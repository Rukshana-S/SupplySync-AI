import httpx
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)

# Try to use 127.0.0.1 explicitly to avoid localhost IPv6/IPv4 resolution issues
DOC_VERIFY_URL = "http://127.0.0.1:8001"

async def verify_document(file: UploadFile, document_type: str) -> dict:
    """
    Sends a document to the Document Verification Agent for AI processing.
    """
    url = f"{DOC_VERIFY_URL}/upload-document"
    logger.info(f"Incoming request to verify document type: {document_type}")
    logger.info(f"Target URL: {url}")
    
    try:
        # We need to read the file content
        file_content = await file.read()
        logger.info(f"Read file: {file.filename}, size: {len(file_content)} bytes")
        
        # Prepare multipart form data
        files = {
            'file': (file.filename, file_content, file.content_type)
        }
        data = {
            'documentType': document_type
        }
        
        logger.info(f"Sending request body with keys: files={list(files.keys())}, data={list(data.keys())}")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, files=files, data=data)
            
            # Reset file cursor if we need to read it again elsewhere (optional)
            await file.seek(0)
            
            logger.info(f"Response status: {response.status_code}")
            
            if response.status_code == 200:
                response_json = response.json()
                logger.info(f"Response JSON: {response_json}")
                return response_json
            else:
                error_text = response.text
                logger.error(f"Agent returned error: {response.status_code} - {error_text}")
                return {"success": False, "message": f"Verification failed with status {response.status_code}: {error_text}"}
                
    except httpx.ConnectError as e:
        logger.error(f"Connection Error: Document Verification Agent is not running at {DOC_VERIFY_URL}. Details: {str(e)}")
        return {"success": False, "message": f"Document Verification Agent is not reachable at {DOC_VERIFY_URL}."}
    except Exception as e:
        logger.exception(f"Unexpected error communicating with Document Verification Agent at {url}")
        return {"success": False, "message": f"Unexpected error: {str(e)}"}

