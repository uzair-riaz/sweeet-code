resource "google_sql_database_instance" "default" {
  name             = var.instance_name
  region           = var.region
  database_version = "POSTGRES_15" # Specify PostgreSQL version
  settings {
    tier = var.db_tier
  }
  # set `deletion_protection` to true, will ensure that one cannot accidentally delete this instance by
  # use of Terraform whereas `deletion_protection_enabled` flag protects this instance at the GCP level.
  deletion_protection = var.deletion_protection
}

resource "google_sql_database" "database" {
  name      = var.database_name
  instance  = google_sql_database_instance.default.name
}

resource "google_sql_user" "users" {
  name     = var.db_user
  instance = google_sql_database_instance.default.name
  password = var.db_password
}
