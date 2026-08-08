terraform {
  required_version = ">= 1.5"

  # Remote state in HCP Terraform. State holds every resource attribute in
  # plaintext, so it is gitignored and previously lived only on one laptop -
  # losing that machine meant losing Terraform's record of these resources.
  # This workspace runs in Local execution mode: HCP stores and locks the
  # state, but plan/apply still run here against local gcloud credentials.
  cloud {
    organization = "yagoromano"
    workspaces {
      name = "personal-website"
    }
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.11"
    }
  }
}

variable "project_id" {
  description = "Globally-unique GCP/Firebase project ID to create."
  type        = string
  default     = "yagoromano"
}

variable "region" {
  description = "Default region for resources that require one."
  type        = string
  default     = "us-central1"
}

variable "github_repo" {
  description = "GitHub repository allowed to assume the deploy service account, in owner/repo form."
  type        = string
  default     = "yagoromano/personal-website"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

resource "google_project" "portfolio" {
  project_id = var.project_id
  name       = var.project_id
  # No org_id / billing_account set: this creates a standalone project under
  # the caller's personal Google account with no organization and no billing
  # account attached, which is required to stay on Firebase's free Spark plan.

  # Project IDs are immutable once created. Changing var.project_id forces
  # Terraform to replace this resource (and everything downstream of it).
  # deletion_policy defaults to "PREVENT", which blocks that replacement, so
  # it's set to "DELETE" here: the old project goes through GCP's standard
  # 30-day recoverable soft-delete, not instant permanent deletion.
  deletion_policy = "DELETE"
}

locals {
  apis = [
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "sts.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each = toset(local.apis)
  project  = google_project.portfolio.project_id
  service  = each.value

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Newly-enabled APIs (especially iam.googleapis.com and firebase.googleapis.com)
# take a short while to propagate through Google's permission-checking layer.
# Resources that call those APIs immediately after enablement can fail with a
# transient 403 even though the caller has the right role. Wait it out rather
# than racing it.
resource "time_sleep" "wait_for_api_propagation" {
  depends_on      = [google_project_service.apis]
  create_duration = "60s"
}

# Adds Firebase to the GCP project. This has the side effect of
# auto-creating a default Hosting site at https://<project_id>.web.app.
# Do NOT also declare google_firebase_hosting_site for the default site,
# it collides with the auto-created one (Error 409: Site already exists).
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.portfolio.project_id

  depends_on = [time_sleep.wait_for_api_propagation]
}

resource "google_iam_workload_identity_pool" "github" {
  project                   = google_project.portfolio.project_id
  workload_identity_pool_id = "github-actions-pool-2"
  display_name              = "GitHub Actions"
  description               = "Pool for GitHub Actions OIDC federation"

  depends_on = [time_sleep.wait_for_api_propagation]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  project                            = google_project.portfolio.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions-provider"
  display_name                       = "GitHub Actions Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == \"${var.github_repo}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "deploy" {
  project      = google_project.portfolio.project_id
  account_id   = "github-actions-deploy"
  display_name = "GitHub Actions Firebase Hosting deploy"

  depends_on = [time_sleep.wait_for_api_propagation]
}

resource "google_service_account_iam_member" "wif_binding" {
  service_account_id = google_service_account.deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}

resource "google_project_iam_member" "deploy_hosting_admin" {
  project = google_project.portfolio.project_id
  role    = "roles/firebasehosting.admin"
  member  = "serviceAccount:${google_service_account.deploy.email}"

  depends_on = [time_sleep.wait_for_api_propagation]
}

output "project_id" {
  value = google_project.portfolio.project_id
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "service_account_email" {
  value = google_service_account.deploy.email
}

output "hosting_url" {
  value = "https://${google_project.portfolio.project_id}.web.app"
}
