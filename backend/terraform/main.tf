terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0" # Use a recent version
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

module "gke_cluster" {
  source              = "./modules/gke"
  project_id          = var.project_id
  cluster_name        = var.cluster_name
  zone                = var.zone
  machine_type        = var.machine_type
  deletion_protection = var.deletion_protection
}

# Cloud SQL (PostgreSQL) Module Instance
module "cloudsql_db" {
  source              = "./modules/cloudsql"
  instance_name       = var.db_instance_name
  database_name       = var.db_name
  db_user             = var.db_user
  db_password         = var.db_password
  db_tier             = var.db_tier             // Choose an appropriate tier
  deletion_protection = var.deletion_protection # Set to true in production

}

# Memorystore (Redis) Module Instance
module "memorystore_cache" {
  source      = "./modules/memorystore"
  instance_id = var.redis_cache_instance_id
  memory_size = 1       # Memory size in GB
  tier        = "BASIC" # Or STANDARD_HA
  region      = var.region
}