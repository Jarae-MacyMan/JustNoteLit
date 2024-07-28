provider "aws" {
    region = "us-east-1"
}


resource "aws_instance" "app_server" {
    ami = "ami-0427090fd1714168b"
    instance_type = "t2.micro"
    key_name = "notes-key-pair"

    security_groups = [aws_security_group.instance_sg.name]

    tags = {
        Name = "notes-app-server"
    }

    user_data = <<-EOF
        #!/bin/bash
        sudo yum update -y
        sudo yum install -y git docker
        sudo service docker start
        sudo usermod -a -G docker ec2-user
        sudo curl -L https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        sudo systemctl enable docker
        chmod 666 /var/run/docker.sock
        cd /home/ec2-user
        git clone https://github.com/Jarae-MacyMan/JustNoteLit
        cd JustNoteLit
        echo "Setup complete. Ready for manual docker-compose up."
    EOF

    connection {
        type = "ssh"
        user = "ec2-user"
        private_key = file(var.private_key_path)
        host = self.public_ip
    }
}

resource "aws_security_group" "instance_sg" {
  name        = "allow_web_traffic"
  description = "Allow HTTP and SSH traffic"

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "React"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Flask API"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Redis"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}     
