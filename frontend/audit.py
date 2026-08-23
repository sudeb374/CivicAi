import asyncio
from playwright.async_api import async_playwright
import os

async def audit():
    output_dir = "/Users/sudebkundu/.gemini/antigravity-ide/brain/72342817-7aa1-47c6-a216-3c4bb2409894"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        errors = []
        page.on("pageerror", lambda err: errors.append(f"Page Error: {err}"))
        page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type == 'error' else None)

        print("Navigating to Dashboard...")
        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f"{output_dir}/dashboard.png")
        print("Dashboard screenshot taken.")
        
        print("Navigating to Citizen Requests...")
        await page.goto("http://localhost:5173/citizen-requests")
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f"{output_dir}/citizen_requests.png")
        
        print("Navigating to Voice Complaints...")
        await page.goto("http://localhost:5173/voice-complaints")
        await page.wait_for_timeout(2000)
        
        # Try to submit a complaint
        print("Submitting a test complaint...")
        try:
            await page.fill('textarea[placeholder*="complaint"]', "The primary school roof is leaking heavily in Kolkata")
            await page.fill('input[placeholder*="village"]', "Kolkata")
            await page.click('button:has-text("Submit")')
            await page.wait_for_timeout(3000)
            await page.screenshot(path=f"{output_dir}/complaint_submitted.png")
            print("Complaint submitted successfully.")
        except Exception as e:
            print(f"Failed to submit complaint: {e}")
            await page.screenshot(path=f"{output_dir}/complaint_error.png")

        print("Navigating to Demand Hotspots...")
        await page.goto("http://localhost:5173/demand-hotspots")
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f"{output_dir}/demand_hotspots.png")
        
        print("Navigating to Recommendations...")
        await page.goto("http://localhost:5173/recommendations")
        await page.wait_for_timeout(4000) # Give Gemini time
        await page.screenshot(path=f"{output_dir}/recommendations.png")

        await browser.close()
        
        if errors:
            print("Errors found during audit:")
            for e in set(errors):
                print(e)
        else:
            print("No console errors found.")

asyncio.run(audit())
