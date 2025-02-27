variable "instance_name" {
  type = string
}

variable "database_name" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_tier" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "deletion_protection" {
  type = bool
}
