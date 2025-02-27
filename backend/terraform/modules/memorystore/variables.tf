variable "instance_id" {
  type = string
}

variable "memory_size" {
  type = number
}

variable "tier" {
  type = string
}

variable "region" {
  type = string
  default = "us-east1"
}
