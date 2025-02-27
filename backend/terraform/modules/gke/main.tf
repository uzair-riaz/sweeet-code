resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.zone
  initial_node_count = 2  # Start with 2 nodes, scale with HPA
  deletion_protection = var.deletion_protection

   # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true


  #  Add network policy if required.
  network_policy {
      enabled = true
  }
}

resource "google_container_node_pool" "primary_nodes" {
    name       = "${var.cluster_name}-node-pool"
    location   = var.zone
    cluster    = google_container_cluster.primary.name
    node_count = 2


    node_config {
      machine_type = var.machine_type  # Choose an appropriate machine type
      oauth_scopes = [
        "https://www.googleapis.com/auth/cloud-platform"
      ]
    }
}