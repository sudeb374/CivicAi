import pytest
from backend.services.priority_engine import compute_priority, get_priority_level

def test_compute_priority_bounds():
    # 0 values
    assert compute_priority(0, 0, 0, 0) == 0.0
    
    # 100 values
    assert compute_priority(100, 100, 100, 100) == 100.0
    
    # Below 0 bounds (should be clipped to 0)
    assert compute_priority(-10, -50, -100, -1000) == 0.0
    
    # Above 100 bounds (should be clipped to 100)
    assert compute_priority(150, 200, 300, 999) == 100.0

def test_compute_priority_formula():
    # 0.40 * 50 + 0.30 * 20 + 0.20 * 80 + 0.10 * 10
    # = 20 + 6 + 16 + 1 = 43
    assert compute_priority(50, 20, 80, 10) == 43.0
    
    # 0.40 * 10 + 0.30 * 100 + 0.20 * 100 + 0.10 * 100
    # = 4 + 30 + 20 + 10 = 64
    assert compute_priority(10, 100, 100, 100) == 64.0

def test_priority_levels():
    # Low: 0-24
    assert get_priority_level(0) == "Low"
    assert get_priority_level(24.9) == "Low"
    
    # Medium: 25-49
    assert get_priority_level(25) == "Medium"
    assert get_priority_level(49.9) == "Medium"
    
    # High: 50-74
    assert get_priority_level(50) == "High"
    assert get_priority_level(74.9) == "High"
    
    # Critical: 75-100
    assert get_priority_level(75) == "Critical"
    assert get_priority_level(100) == "Critical"
