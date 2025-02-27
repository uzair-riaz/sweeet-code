variable "project_id" {
  type        = string
  description = "The ID of the Google Cloud project"
}

variable "region" {
  type        = string
  description = "The region to deploy resources"
  default     = "us-central1"
}

variable "zone" {
  type        = string
  description = "The zone to deploy resources"
  default     = "us-central1-a"
}

variable "db_instance_name" {
  type        = string
  description = "Database instance name"
}

variable "db_tier" {
  type        = string
  description = "Database tier"
}

variable "db_name" {
  type        = string
  description = "Database name"
}

variable "db_user" {
  type        = string
  description = "Username for the Cloud SQL database user"
}

variable "db_password" {
  type        = string
  description = "Password for the Cloud SQL database user"
  sensitive   = true # Mark as sensitive to prevent display in output
}

variable "redis_cache_instance_id" {
  type        = string
  description = "The ID of the Redis cache instance"
}

variable "machine_type" {
  type        = string
  description = "The machine type for the GKE cluster"
}

variable "cluster_name" {
  type        = string
  description = "The name of the GKE cluster"
}

variable "deletion_protection" {
  type        = bool
  description = "Enable deletion protection"
}