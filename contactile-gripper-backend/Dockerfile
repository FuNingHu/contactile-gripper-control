FROM python:3.11-alpine

# Install Python dependencies
RUN pip install --no-cache-dir pyserial

# Copy application code into Docker image
COPY src src/

# Expose the Flask port
EXPOSE 36963

# Run the REST service
ENTRYPOINT ["python", "-u","src/xmlrpc-gripper.py"]