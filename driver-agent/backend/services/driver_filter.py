from database import drivers_collection

def generate_insight(driver, score, rank):
    city = driver.get("current_location", "Unknown")
    exp = driver.get("experience_years", 0)
    trips = driver.get("completed_trips", 0)
    rating = driver.get("rating", 0)
    on_time = driver.get("on_time_percentage", 0)
    safety = driver.get("safety_score", 0)

    if rank == 1:
        base = f"Best match because the driver is currently in {city}, "
    elif rank == 2:
        base = f"Highly competitive driver in {city}, "
    else:
        base = f"Reliable nearby driver in {city}, "

    reasons = []
    if exp >= 10:
        reasons.append("has extensive driving experience")
    elif exp >= 5:
        reasons.append("has solid driving experience")
        
    if rating >= 4.8:
        reasons.append("excellent customer ratings")
    elif rating >= 4.0:
        reasons.append("good customer ratings")
        
    if trips > 1000:
        reasons.append("a proven track record of completed trips")
        
    if on_time >= 95:
        reasons.append("a very high on-time delivery percentage")
        
    if safety >= 95:
        reasons.append("an outstanding safety record")

    if reasons:
        if len(reasons) > 1:
            reasons_str = ", ".join(reasons[:-1]) + f", and {reasons[-1]}."
        else:
            reasons_str = reasons[0] + "."
        return base + reasons_str
    
    return f"Recommended driver currently available in {city}."


def calculate_score(driver, pickup_location):
    score = 0
    
    # 1. Current City Match (30%) - We already strictly filtered for this, so this is guaranteed if they made it here
    score += 30
        
    # 2. Experience Years (20%) - Normalize to max 20 years
    experience = driver.get("experience_years", 0)
    score += (min(experience, 20) / 20.0) * 20
    
    # 3. Completed Trips (20%) - Normalize to max 2500 trips
    trips = driver.get("completed_trips", 0)
    score += (min(trips, 2500) / 2500.0) * 20
    
    # 4. Overall Rating (15%) - Out of 5.0
    rating = driver.get("rating", 0.0)
    score += (rating / 5.0) * 15
    
    # 5. On-Time Percentage (10%) - Out of 100
    on_time = driver.get("on_time_percentage", 0)
    score += (on_time / 100.0) * 10
    
    # 6. Safety Score (5%) - Out of 100
    safety = driver.get("safety_score", 0)
    score += (safety / 100.0) * 5
    
    return round(score, 1)


def filter_drivers(shipment):
    print("=== DRIVER RECOMMENDATION AGENT DEBUG ===")
    from database import drivers_collection
    
    db_name = drivers_collection.database.name
    coll_name = drivers_collection.name
    total_docs = drivers_collection.count_documents({})
    print(f"1. Database: {db_name}, Collection: {coll_name}, Total Documents: {total_docs}")
    
    raw_pickup = shipment.pickupLocation
    pickup_loc = raw_pickup.strip().lower()
    print(f"2. Exact Pickup Location Received: '{raw_pickup}' -> Normalized: '{pickup_loc}'")
    
    # We will fetch all and do filtering manually to print the counts
    drivers = list(drivers_collection.find({}, {"_id": 0}))
    
    print(f"Total drivers fetched from DB: {len(drivers)}")
    
    # Filter 1: City
    f1 = [d for d in drivers if d.get("current_location", "").strip().lower() == pickup_loc]
    print(f"After City filter: {len(f1)}")
    
    # Filter 2: Availability
    f2 = [d for d in f1 if d.get("available") == True or d.get("availability") == True]
    print(f"After availability filter: {len(f2)}")
    
    # Filter 3: Status
    f3 = [d for d in f2 if d.get("status", "").lower() in ["available", "idle"]]
    print(f"After status filter: {len(f3)}")
    
    # Filter 4: Verified
    f4 = [d for d in f3 if d.get("verified") == True or d.get("driver_status") == "Verified"]
    print(f"After verified filter: {len(f4)}")
    
    # Filter 5: DocumentVerified
    f5 = [d for d in f4 if d.get("documentVerified") == True or d.get("verification_status") == "Verified"]
    print(f"After documentVerified filter: {len(f5)}")
    
    # Filter 6: VerificationStatus
    f6 = [d for d in f5 if d.get("verificationStatus") == "Verified" or d.get("verification_status") == "Verified"]
    print(f"After verificationStatus filter: {len(f6)}")
    
    # Filter 7: ApprovalStatus
    # Since drivers_200 doesn't have approvalStatus, just allow it
    f7 = [d for d in f6 if d.get("approvalStatus") in ["Approved", None] or "approvalStatus" not in d]
    print(f"After approvalStatus filter: {len(f7)}")
    
    eligible = []
    
    for driver in f7:
        # Prevent mock drivers
        if "mock" in str(driver.get("driver_id", "")).lower():
            continue
            
        # Map fields properly as requested by user
        driver["rating"] = driver.get("overall_rating", driver.get("rating", 0))
        
        # Calculate AI Score
        score = calculate_score(driver, pickup_loc)
        driver["recommendationScore"] = score
        eligible.append(driver)

    # Sort descending by score
    eligible.sort(key=lambda x: x["recommendationScore"], reverse=True)
    
    # Return top 3 and others separately
    top_3 = eligible[:3]
    others = eligible[3:]
    
    # Generate insights for top 3
    for i, driver in enumerate(top_3):
        driver["aiReason"] = generate_insight(driver, driver["recommendationScore"], i + 1)
        
    print(f"Final Eligible Drivers returning: {len(eligible)}")
    print("=========================================")
        
    return top_3, others