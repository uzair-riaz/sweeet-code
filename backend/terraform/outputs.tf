output "cloudsql_instance_connection_name" {
  value = module.cloudsql_db.instance_connection_name
}

output "memorystore_host" {
  value = module.memorystore_cache.host
}