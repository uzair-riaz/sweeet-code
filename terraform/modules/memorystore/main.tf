resource "google_redis_instance" "cache" {
  name           = var.instance_id
  tier           = var.tier
  memory_size_gb = var.memory_size
  region         = var.region
}
