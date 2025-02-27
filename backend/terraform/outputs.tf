output "cloudsql_instance_connection_name" {
  value = module.cloudsql_db.instance_connection_name
}

output "firestore_database_name" {
  value = module.firestore_db.database_name
}

output "memorystore_host" {
  value = module.memorystore_cache.host
}

output "bigquery_dataset_id" {
  value = module.bigquery_analytics.dataset_id
}

output "cloud_storage_bucket_url" {
  value = module.cloud_storage_bucket.bucket_url
}
