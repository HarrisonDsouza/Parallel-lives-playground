"""
Simple seeded market divergence simulator.
Input: baseSeed (string) and decision tags.
Output: small state object containing `wealthMultiplier` and events.

This is a mock. Replace with real market data engine by calling a market API.
"""

import hashlib
import random

def seeded_random(seed):
    """Deterministic pseudo-random generator based on seed"""
    random.seed(seed)
    return random.random

def simulate_timeline(seed, choices=None):
    """
    simulateTimeline
    @param {string} seed - unique timeline seed (id + choices)
    @param {list} choices - user decisions that bias divergence
    """
    if choices is None:
        choices = []
    
    # Create a deterministic seed
    combined_seed = seed + '|'.join(choices)
    hash_object = hashlib.sha256(combined_seed.encode())
    numeric_seed = int(hash_object.hexdigest()[:8], 16)
    
    rnd = seeded_random(numeric_seed)
    
    # base multiplier between 0.6 and 1.6
    base = 0.6 + rnd() * 1.0

    # apply biases: certain choices increase/decrease multiplier
    bias = 1.0
    for choice in choices:
        lc = choice.lower()
        if 'save' in lc:
            bias += 0.15
        if 'invest' in lc:
            bias += 0.2
        if 'spend' in lc:
            bias -= 0.2
        if 'lemonade' in lc or 'side' in lc:
            bias += 0.05
        if 'pokemon' in lc:
            bias -= 0.05

    # create simple event stream
    events = []
    n = 3 + int(rnd() * 3)
    for i in range(n):
        chance = rnd()
        if chance < 0.3:
            events.append({
                'type': 'windfall', 
                'text': 'Small windfall from side project', 
                'impact': 0.1 * rnd()
            })
        elif chance < 0.6:
            events.append({
                'type': 'expense', 
                'text': 'Unexpected expense', 
                'impact': -0.08 * rnd()
            })
        else:
            events.append({
                'type': 'growth', 
                'text': 'Long-term growth', 
                'impact': 0.05 * rnd()
            })

    # compute final multiplier
    multiplier = base * bias
    # apply events
    for event in events:
        multiplier += event['impact']

    # clamp
    if multiplier < 0.2:
        multiplier = 0.2
    if multiplier > 3.0:
        multiplier = 3.0

    # emotional score: lower multiplier -> worse outcome
    emotional = max(0, min(1, (multiplier - 0.2) / (3.0 - 0.2)))

    return {
        'multiplier': round(multiplier, 3),
        'events': events,
        'emotional': emotional,
        'seed': seed
    }