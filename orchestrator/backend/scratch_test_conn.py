import httpx
import asyncio
import traceback

async def test_conn():
    url = "http://127.0.0.1:8001/health"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            print("Status:", resp.status_code)
            print("Response:", resp.json())
    except Exception as e:
        print("Error details:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_conn())
