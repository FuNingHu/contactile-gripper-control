FROM python:3.11-alpine

COPY requirements.txt ./
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

ENV APP_NAME xmlrpc-gripper
WORKDIR /usr/local/src/${APP_NAME}

# Copy application code into Docker image
COPY src .

# Expose the Flask port
EXPOSE 36963

# Run the REST service
ENTRYPOINT ["python", "-u","xmlrpc-gripper.py"]