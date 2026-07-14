# Stage 1: Build Environment
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
# Install dependencies into a user-specific directory
RUN pip install --user -r requirements.txt

# Stage 2: Production Environment
FROM python:3.11-slim
WORKDIR /app

# Create a secure non-root user
RUN useradd -m appuser

# Copy installed dependencies and source code
COPY --from=builder /root/.local /home/appuser/.local
COPY . .

# Grant ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user and ensure local bin is in the PATH
USER appuser
ENV PATH=/home/appuser/.local/bin:$PATH

CMD ["python", "-u", "worker.py"]