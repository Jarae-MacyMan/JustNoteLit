FROM python:3.11.2-slim-buster

# Set the working directory in the container

WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Make port 8000 available 
EXPOSE 8000

# Run main.py when the container launches
CMD ["python", "main.py"]
