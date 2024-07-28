#---root/main.tf---#

provider "aws" {
  region = local.location
}


locals {
    cwd           = reverse(split("/", path.cwd))
    instance_type = local.cwd[1]
    location      = local.cwd[2]
    environment   = local.cwd[3]
}

module "instance" {
    source = "../../../../../modules/dev/instance"
    instance_type = local.instance_type
    instance_count = 2
    subnet_id = module.vpc.subnet_id
}

module "vpc" {
    source = "../../../../../modules/dev/vpc"
    az = var.az
    vpc_cidr_block = var.vpc_cidr_block
    subnet_cidr_block = var.subnet_cidr_block
}
