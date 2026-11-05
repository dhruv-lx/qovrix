/**
 * AI Text Generator - Generate high-quality text content for posters
 * Modular architecture - completely isolated from core logic
 * USER EDITOR ONLY
 */

class AITextGenerator {
    constructor() {
        this.businessTypes = [
            'Restaurant', 'Gym', 'Coaching', 'Retail', 'Salon', 'Cafe', 
            'Fitness', 'Education', 'Healthcare', 'Real Estate', 'Consulting',
            'Technology', 'Photography', 'Events', 'Travel', 'Fashion'
        ];

        this.tones = [
            { value: 'professional', label: 'Professional' },
            { value: 'bold', label: 'Bold' },
            { value: 'friendly', label: 'Friendly' }
        ];

        // AI API Configuration
        this.aiConfig = {
            enabled: false, // Set to true to enable AI generation
            apiKey: localStorage.getItem('ai_api_key') || '',
            provider: localStorage.getItem('ai_provider') || 'openai', // 'openai', 'gemini', or 'free'
            model: 'gpt-3.5-turbo', // or 'gemini-pro' or free models
            maxTokens: 150,
            freeProvider: 'groq' // 'groq' or 'huggingface'
        };

        // Load API key from localStorage
        this.loadApiKey();
    }

    /**
     * Load API key from localStorage
     */
    loadApiKey() {
        const savedKey = localStorage.getItem('ai_api_key');
        const savedProvider = localStorage.getItem('ai_provider') || 'openai';
        const savedFreeProvider = localStorage.getItem('ai_free_provider') || 'groq';
        
        if (savedKey) {
            this.aiConfig.apiKey = savedKey;
            this.aiConfig.provider = savedProvider;
            this.aiConfig.freeProvider = savedFreeProvider;
            this.aiConfig.enabled = true;
        }
    }

    /**
     * Save API key to localStorage
     */
    saveApiKey(apiKey, provider = 'openai') {
        localStorage.setItem('ai_api_key', apiKey);
        localStorage.setItem('ai_provider', provider);
        this.aiConfig.apiKey = apiKey;
        this.aiConfig.provider = provider;
        this.aiConfig.enabled = !!apiKey;
    }

    /**
     * Configure AI API
     */
    configureAI(apiKey, provider = 'openai') {
        this.saveApiKey(apiKey, provider);
        return this.aiConfig.enabled;
    }

    /**
     * Generate text using AI API
     */
    async generateWithAI(businessType, tone, customOffer = '') {
        if (!this.aiConfig.enabled || !this.aiConfig.apiKey) {
            throw new Error('AI API not configured. Please set up your API key.');
        }

        const prompt = this.createPrompt(businessType, tone, customOffer);
        
        try {
            let response;
            
            if (this.aiConfig.provider === 'openai') {
                response = await this.callOpenAI(prompt);
            } else if (this.aiConfig.provider === 'gemini') {
                response = await this.callGemini(prompt);
            } else if (this.aiConfig.provider === 'free') {
                if (this.aiConfig.freeProvider === 'groq') {
                    response = await this.callGroq(prompt);
                } else if (this.aiConfig.freeProvider === 'huggingface') {
                    response = await this.callHuggingFace(prompt);
                } else {
                    throw new Error('Unsupported free provider');
                }
            } else {
                throw new Error('Unsupported AI provider');
            }

            return this.parseAIResponse(response);
        } catch (error) {
            console.error('AI generation failed:', error);
            throw new Error('Failed to generate text with AI: ' + error.message);
        }
    }

    /**
     * Create prompt for AI
     */
    createPrompt(businessType, tone, customOffer) {
        const toneDescriptions = {
            professional: 'professional, formal, business-focused',
            bold: 'bold, energetic, attention-grabbing, exciting',
            friendly: 'friendly, casual, approachable, warm'
        };

        const prompt = `Generate marketing text for a ${businessType} business. The tone should be ${toneDescriptions[tone]}.

${customOffer ? `Special offer to highlight: "${customOffer}"` : ''}

Please generate exactly:
1. Three headline options (short, catchy, attention-grabbing)
2. Two offer lines (highlighting value proposition)
3. Two call-to-action options (clear, actionable)

Format your response as JSON:
{
  "headlines": ["headline1", "headline2", "headline3"],
  "offers": ["offer1", "offer2"],
  "ctas": ["cta1", "cta2"]
}

Make the text compelling and suitable for marketing posters. Keep headlines under 60 characters, offers under 80 characters, and CTAs under 40 characters.`;

        return prompt;
    }

    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: this.aiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional marketing copywriter specializing in creating compelling text for business posters and advertisements.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.aiConfig.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Call Groq API (Free)
     */
    async callGroq(prompt) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Free model
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional marketing copywriter specializing in creating compelling text for business posters and advertisements.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.aiConfig.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Call Hugging Face API (Free)
     */
    async callHuggingFace(prompt) {
        // Using a simpler approach with Hugging Face's free inference API
        const response = await fetch(`https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.aiConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `<s>[INST] You are a professional marketing copywriter. ${prompt} [/INST]`,
                parameters: {
                    max_new_tokens: this.aiConfig.maxTokens,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Hugging Face API error');
        }

        const data = await response.json();
        return data[0]?.generated_text || 'Failed to generate text';
    }

    /**
     * Call Gemini API
     */
    async callGemini(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.aiConfig.model}:generateContent?key=${this.aiConfig.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a professional marketing copywriter specializing in creating compelling text for business posters and advertisements.\n\n${prompt}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: this.aiConfig.maxTokens
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Parse AI response
     */
    parseAIResponse(response) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                
                // Validate structure
                if (parsed.headlines && parsed.offers && parsed.ctas) {
                    return {
                        headlines: parsed.headlines.slice(0, 3),
                        offers: parsed.offers.slice(0, 2),
                        ctas: parsed.ctas.slice(0, 2)
                    };
                }
            }
            
            // Fallback: parse text manually
            return this.parseTextResponse(response);
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.parseTextResponse(response);
        }
    }

    /**
     * Parse text response as fallback
     */
    parseTextResponse(response) {
        const lines = response.split('\n').filter(line => line.trim());
        const headlines = [];
        const offers = [];
        const ctas = [];

        let currentSection = 'headlines';
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.toLowerCase().includes('headline')) {
                currentSection = 'headlines';
                continue;
            } else if (trimmed.toLowerCase().includes('offer')) {
                currentSection = 'offers';
                continue;
            } else if (trimmed.toLowerCase().includes('cta') || trimmed.toLowerCase().includes('call to action')) {
                currentSection = 'ctas';
                continue;
            }
            
            // Remove bullet points, numbers, and quotes
            const cleanText = trimmed.replace(/^[\d\.\-\*\•\"]+|\"$/g, '').trim();
            
            if (cleanText && cleanText.length > 5) {
                if (currentSection === 'headlines' && headlines.length < 3) {
                    headlines.push(cleanText);
                } else if (currentSection === 'offers' && offers.length < 2) {
                    offers.push(cleanText);
                } else if (currentSection === 'ctas' && ctas.length < 2) {
                    ctas.push(cleanText);
                }
            }
        }

        // Ensure we have enough content
        while (headlines.length < 3) {
            headlines.push(`Amazing ${currentSection === 'headlines' ? 'Headline' : 'Offer'}`);
        }
        while (offers.length < 2) {
            offers.push(`Special Offer ${offers.length + 1}`);
        }
        while (ctas.length < 2) {
            ctas.push(`Act Now ${ctas.length + 1}`);
        }

        return { headlines, offers, ctas };
    }

    /**
     * Generate text content (AI or templates)
     */
    async generateText(businessType, tone, customOffer = '', useAI = false) {
        if (useAI && this.aiConfig.enabled) {
            try {
                return await this.generateWithAI(businessType, tone, customOffer);
            } catch (error) {
                console.warn('AI generation failed, falling back to templates:', error);
                // Fallback to templates
            }
        }

        // Use templates
        const type = businessType.toLowerCase();
        const templates = this.templates[type] || this.templates.default;
        const toneTemplates = templates[tone] || templates.professional;

        // Get random variations
        const getRandomItems = (arr, count) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        const headlines = getRandomItems(toneTemplates.headlines, 3);
        const offers = customOffer ? [customOffer] : getRandomItems(toneTemplates.offers, 2);
        const ctas = getRandomItems(toneTemplates.ctas, 2);

        return {
            headlines,
            offers,
            ctas
        };
    }

    // Templates (fallback when AI is not available)
    templates = {
            restaurant: {
                professional: {
                    headlines: [
                        "Experience Fine Dining Excellence",
                        "Premium Culinary Journey Awaits",
                        "Indulge in Gourmet Excellence",
                        "Where Quality Meets Tradition"
                    ],
                    offers: [
                        "Exclusive Chef's Tasting Menu Available",
                        "Complimentary Wine Pairing This Weekend",
                        "Special Seasonal Menu Now Serving"
                    ],
                    ctas: [
                        "Reserve Your Table",
                        "Book Your Experience",
                        "Dine With Us Tonight"
                    ]
                },
                bold: {
                    headlines: [
                        "🔥 Best Food in Town! 🔥",
                        "TASTE PERFECTION OR YOUR MONEY BACK!",
                        "THE ULTIMATE DINING EXPERIENCE!",
                        "WHERE LEGENDS ARE MADE!"
                    ],
                    offers: [
                        "50% OFF Entire Menu - Today Only!",
                        "FREE Appetizer with Every Main Course!",
                        "Happy Hour All Day Long!"
                    ],
                    ctas: [
                        "ORDER NOW!",
                        "GET YOUR SEAT!",
                        "TASTE IT NOW!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Come Hungry, Leave Happy! 😊",
                        "Your Favorite Neighborhood Spot",
                        "Good Food, Good Vibes",
                        "Where Friends Gather & Memories Begin"
                    ],
                    offers: [
                        "Bring a Friend, Get 25% Off!",
                        "Kids Eat Free Every Weekend!",
                        "Family Special: Feed 4 for $50!"
                    ],
                    ctas: [
                        "Join Us for Dinner",
                        "Come Say Hello",
                        "See You Soon!"
                    ]
                }
            },
            gym: {
                professional: {
                    headlines: [
                        "Transform Your Fitness Journey",
                        "Achieve Your Peak Performance",
                        "Professional Training Solutions",
                        "Elevate Your Health & Wellness"
                    ],
                    offers: [
                        "Complimentary Fitness Assessment",
                        "Personal Training Package Available",
                        "Premium Membership Benefits"
                    ],
                    ctas: [
                        "Start Your Journey",
                        "Schedule Consultation",
                        "Join Our Community"
                    ]
                },
                bold: {
                    headlines: [
                        "💪 BECOME UNSTOPPABLE! 💪",
                        "NO EXCUSES, JUST RESULTS!",
                        "TRANSFORM YOUR BODY TODAY!",
                        "THE HARDEST BODIES ARE BUILT HERE!"
                    ],
                    offers: [
                        "GET 50% OFF MEMBERSHIP NOW!",
                        "FIRST MONTH FREE - LIMITED TIME!",
                        "BRING A FRIEND, JOIN FOR FREE!"
                    ],
                    ctas: [
                        "JOIN NOW!",
                        "START TODAY!",
                        "GET FIT NOW!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Fitness Family Awaits! 🏋️",
                        "Fun Workouts, Amazing Results",
                        "Together We're Stronger",
                        "Where Fitness Meets Friendship"
                    ],
                    offers: [
                        "Bring a Buddy, Split the Cost!",
                        "Free Trial Week - No Strings!",
                        "Group Class Special: 2 for 1!"
                    ],
                    ctas: [
                        "Try a Free Class",
                        "Join Our Community",
                        "Let's Get Started!"
                    ]
                }
            },
            coaching: {
                professional: {
                    headlines: [
                        "Unlock Your Full Potential",
                        "Strategic Growth & Development",
                        "Expert Guidance for Success",
                        "Transform Your Career Path"
                    ],
                    offers: [
                        "Complimentary Strategy Session",
                        "Personalized Development Plan",
                        "Executive Coaching Package"
                    ],
                    ctas: [
                        "Book Your Session",
                        "Start Your Journey",
                        "Schedule Consultation"
                    ]
                },
                bold: {
                    headlines: [
                        "🚀 CRUSH YOUR GOALS! 🚀",
                        "SUCCESS IS YOUR ONLY OPTION!",
                        "DOMINATE YOUR FIELD!",
                        "BECOME UNSTOPPABLE!"
                    ],
                    offers: [
                        "50% OFF FIRST MONTH COACHING!",
                        "FREE SUCCESS STRATEGY CALL!",
                        "LIMITED SPOTS - ACT FAST!"
                    ],
                    ctas: [
                        "START WINNING!",
                        "LEVEL UP NOW!",
                        "CRUSH IT TODAY!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Success Story Starts Here! 🌟",
                        "Together We'll Achieve More",
                        "Guiding You to Greatness",
                        "Your Personal Cheerleader"
                    ],
                    offers: [
                        "Free Discovery Call - Let's Chat!",
                        "Bring a Friend, Save 25%!",
                        "First Session Half Price!"
                    ],
                    ctas: [
                        "Let's Talk Soon",
                        "Start Your Journey",
                        "Reach Out Today"
                    ]
                }
            },
            retail: {
                professional: {
                    headlines: [
                        "Premium Shopping Experience",
                        "Curated Collection for You",
                        "Quality Products, Trusted Service",
                        "Discover Excellence in Retail"
                    ],
                    offers: [
                        "Exclusive Member Benefits",
                        "Personal Shopping Service Available",
                        "Seasonal Collection Launch"
                    ],
                    ctas: [
                        "Shop Now",
                        "Visit Our Store",
                        "Explore Collection"
                    ]
                },
                bold: {
                    headlines: [
                        "🛍️ HOTTEST DEALS IN TOWN! 🛍️",
                        "PRICES SO LOW, YOU'LL SHOUT!",
                        "SHOP TILL YOU DROP!",
                        "UNBEATABLE DEALS ALERT!"
                    ],
                    offers: [
                        "UP TO 70% OFF EVERYTHING!",
                        "DOORCRASHER DEALS - TODAY ONLY!",
                        "BUY ONE, GET ONE FREE!"
                    ],
                    ctas: [
                        "SHOP NOW!",
                        "GRAB THE DEALS!",
                        "BUY NOW!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Happy Place for Shopping! 🛒",
                        "Where Friends Shop Together",
                        "Find Your Perfect Match",
                        "Shopping Made Fun & Easy"
                    ],
                    offers: [
                        "Bring a Friend, Get 20% Off!",
                        "Weekend Special: Extra 15% Off!",
                        "Loyalty Rewards Double Points!"
                    ],
                    ctas: [
                        "Come Say Hi",
                        "Happy Shopping",
                        "See You Soon"
                    ]
                }
            },
            salon: {
                professional: {
                    headlines: [
                        "Elevate Your Beauty Experience",
                        "Premium Hair & Beauty Services",
                        "Expert Styling for You",
                        "Transform Your Look Today"
                    ],
                    offers: [
                        "Complimentary Consultation",
                        "Signature Treatment Package",
                        "VIP Membership Benefits"
                    ],
                    ctas: [
                        "Book Your Appointment",
                        "Schedule Consultation",
                        "Visit Our Salon"
                    ]
                },
                bold: {
                    headlines: [
                        "💇‍♀️ LOOK FABULOUS NOW! 💇‍♀️",
                        "TRANSFORM YOUR STYLE INSTANTLY!",
                        "BEAUTY THAT TURNS HEADS!",
                        "THE ULTIMATE MAKEOVER!"
                    ],
                    offers: [
                        "50% OFF ALL COLOR SERVICES!",
                        "FREE BLOWOUT WITH ANY CUT!",
                        "BRING A FRIEND, SAVE BIG!"
                    ],
                    ctas: [
                        "BOOK NOW!",
                        "GET GLAM NOW!",
                        "TRANSFORM TODAY!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Beauty Sanctuary! ✨",
                        "Where Beauty Meets Relaxation",
                        "Feel Beautiful, Feel Confident",
                        "Your Personal Beauty Experts"
                    ],
                    offers: [
                        "Bring a Friend, Both Save 25%!",
                        "First-Time Client Special!",
                        "Weekend Pampering Package!"
                    ],
                    ctas: [
                        "Treat Yourself",
                        "Book Your Escape",
                        "Come Visit Us"
                    ]
                }
            },
            cafe: {
                professional: {
                    headlines: [
                        "Premium Coffee Experience",
                        "Artisanal Coffee & Pastries",
                        "Your Daily Coffee Ritual",
                        "Excellence in Every Cup"
                    ],
                    offers: [
                        "Coffee Subscription Available",
                        "Corporate Catering Services",
                        "Seasonal Specialty Menu"
                    ],
                    ctas: [
                        "Visit Our Cafe",
                        "Order Online",
                        "Experience Excellence"
                    ]
                },
                bold: {
                    headlines: [
                        "☕ BEST COFFEE IN TOWN! ☕",
                        "WAKE UP TO PERFECTION!",
                        "COFFEE THAT CHANGES LIVES!",
                        "FUEL YOUR DAY RIGHT!"
                    ],
                    offers: [
                        "BUY ONE, GET ONE FREE!",
                        "HAPPY HOUR: 50% OFF ALL DRINKS!",
                        "FREE PASTRY WITH ANY COFFEE!"
                    ],
                    ctas: [
                        "GET COFFEE NOW!",
                        "FUEL UP!",
                        "ORDER NOW!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Cozy Coffee Corner! ☕",
                        "Good Coffee, Good Company",
                        "Where Mornings Begin",
                        "Your Daily Happiness Dose"
                    ],
                    offers: [
                        "Bring a Mug, Get 10% Off!",
                        "Loyalty Card: Buy 9, Get 1 Free!",
                        "Weekend Special: Pastry + Coffee!"
                    ],
                    ctas: [
                        "Come Say Hi",
                        "Grab a Coffee",
                        "See You Soon"
                    ]
                }
            },
            fitness: {
                professional: {
                    headlines: [
                        "Achieve Your Fitness Goals",
                        "Personalized Training Programs",
                        "Wellness & Performance Center",
                        "Your Health Investment"
                    ],
                    offers: [
                        "Free Fitness Assessment",
                        "Custom Training Plan Available",
                        "Nutrition Coaching Included"
                    ],
                    ctas: [
                        "Start Today",
                        "Book Assessment",
                        "Join Now"
                    ]
                },
                bold: {
                    headlines: [
                        "🔥 SWEAT, SMILE, REPEAT! 🔥",
                        "NO PAIN, NO GAIN!",
                        "BECOME YOUR BEST SELF!",
                        "RESULTS DRIVEN FITNESS!"
                    ],
                    offers: [
                        "30% OFF ALL MEMBERSHIPS!",
                        "FREE PERSONAL TRAINING SESSION!",
                        "SUMMER BODY CHALLENGE!"
                    ],
                    ctas: [
                        "JOIN NOW!",
                        "START SWEATING!",
                        "GET FIT TODAY!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Fitness Family! 💪",
                        "Fun Workouts, Real Results",
                        "Together We're Stronger",
                        "Fitness Made Enjoyable"
                    ],
                    offers: [
                        "Bring a Friend Workout Free!",
                        "First Class Free Trial!",
                        "Group Fitness Special!"
                    ],
                    ctas: [
                        "Try a Class",
                        "Join Our Family",
                        "Get Started"
                    ]
                }
            },
            education: {
                professional: {
                    headlines: [
                        "Excellence in Education",
                        "Your Path to Success",
                        "Quality Learning Experience",
                        "Invest in Your Future"
                    ],
                    offers: [
                        "Free Trial Class Available",
                        "Personalized Learning Plan",
                        "Expert Instructor Guidance"
                    ],
                    ctas: [
                        "Enroll Today",
                        "Start Learning",
                        "Book Consultation"
                    ]
                },
                bold: {
                    headlines: [
                        "🎓 KNOWLEDGE IS POWER! 🎓",
                        "TRANSFORM YOUR FUTURE NOW!",
                        "BECOME UNSTOPPABLE!",
                        "SUCCESS STARTS HERE!"
                    ],
                    offers: [
                        "50% OFF FIRST COURSE!",
                        "FREE SKILL ASSESSMENT!",
                        "LIMITED SPOTS AVAILABLE!"
                    ],
                    ctas: [
                        "ENROLL NOW!",
                        "START LEARNING!",
                        "LEVEL UP!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Learning Journey! 📚",
                        "Learn, Grow, Succeed Together",
                        "Making Education Enjoyable",
                        "Your Success Story Begins"
                    ],
                    offers: [
                        "Study Together, Save 25%!",
                        "Free Orientation Session!",
                        "Bring a Friend Bonus!"
                    ],
                    ctas: [
                        "Join Our Class",
                        "Start Learning",
                        "Learn Together"
                    ]
                }
            },
            healthcare: {
                professional: {
                    headlines: [
                        "Your Health, Our Priority",
                        "Comprehensive Healthcare Solutions",
                        "Expert Medical Care",
                        "Wellness & Prevention Focus"
                    ],
                    offers: [
                        "Free Health Screening",
                        "Preventive Care Package",
                        "Specialist Consultation Available"
                    ],
                    ctas: [
                        "Book Appointment",
                        "Schedule Consultation",
                        "Visit Our Clinic"
                    ]
                },
                bold: {
                    headlines: [
                        "🏥 HEALTH IS WEALTH! 🏥",
                        "DON'T WAIT, GET CHECKED!",
                        "YOUR HEALTH MATTERS!",
                        "EXPERT CARE NOW!"
                    ],
                    offers: [
                        "FREE HEALTH CHECKUP!",
                        "50% OFF SPECIALIST FEES!",
                        "EMERGENCY CARE AVAILABLE!"
                    ],
                    ctas: [
                        "GET CHECKED NOW!",
                        "BOOK NOW!",
                        "CALL TODAY!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Healthcare Family! ❤️",
                        "Caring for Your Wellness",
                        "Health with a Human Touch",
                        "Your Partner in Health"
                    ],
                    offers: [
                        "Family Health Package Deal!",
                        "Senior Citizen Special!",
                        "New Patient Welcome Gift!"
                    ],
                    ctas: [
                        "Visit Us Soon",
                        "Stay Healthy",
                        "Care for You"
                    ]
                }
            },
            default: {
                professional: {
                    headlines: [
                        "Excellence in Every Detail",
                        "Quality You Can Trust",
                        "Professional Service Guaranteed",
                        "Your Satisfaction is Our Priority"
                    ],
                    offers: [
                        "Premium Service Package Available",
                        "Complimentary Consultation",
                        "Exclusive Member Benefits"
                    ],
                    ctas: [
                        "Contact Us Today",
                        "Get Started Now",
                        "Learn More"
                    ]
                },
                bold: {
                    headlines: [
                        "🔥 THE BEST CHOICE! 🔥",
                        "DON'T MISS OUT!",
                        "UNBEATABLE QUALITY!",
                        "LIMITED TIME OFFER!"
                    ],
                    offers: [
                        "50% OFF EVERYTHING!",
                        "SPECIAL DEAL ALERT!",
                        "ACT FAST - LIMITED TIME!"
                    ],
                    ctas: [
                        "ORDER NOW!",
                        "GET IT TODAY!",
                        "ACT NOW!"
                    ]
                },
                friendly: {
                    headlines: [
                        "Your Trusted Partner! 🤝",
                        "Service with a Smile",
                        "Here to Help You Succeed",
                        "Making Things Easy"
                    ],
                    offers: [
                        "Friend Referral Bonus!",
                        "First-Time Customer Special!",
                        "Loyalty Rewards Inside!"
                    ],
                    ctas: [
                        "Come Say Hi",
                        "Let's Connect",
                        "See You Soon"
                    ]
                }
            }
        };

    /**
     * Get business type suggestions
     */
    getBusinessTypeSuggestions(query = '') {
        if (!query) return this.businessTypes;
        
        return this.businessTypes.filter(type => 
            type.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Apply generated text to selected element
     */
    applyTextToElement(text, elementId = null) {
        const editor = window.editor;
        if (!editor) {
            console.error('Editor not found');
            return false;
        }

        if (elementId) {
            // Apply to specific element
            const element = editor.elements.find(el => el.id === elementId);
            if (element && element.type === 'text') {
                element.text = text;
                editor.render();
                return true;
            }
        } else {
            // Apply to selected element or create new one
            if (editor.selectedElement && editor.selectedElement.type === 'text') {
                editor.selectedElement.text = text;
                editor.render();
                return true;
            } else {
                // Create new text element
                const newElement = {
                    id: `text_${Date.now()}`,
                    type: 'text',
                    text: text,
                    x: 100,
                    y: 100,
                    fontSize: 24,
                    fontFamily: 'Inter, sans-serif',
                    color: '#000000',
                    fontWeight: 'normal'
                };
                
                editor.elements.push(newElement);
                editor.render();
                return true;
            }
        }

        return false;
    }
}

// UI Controller for AI Text Generator
class AITextGeneratorUI {
    constructor() {
        this.generator = new AITextGenerator();
        this.modal = null;
        this.generatedContent = null;
    }

    /**
     * Initialize AI Text Generator for user editor
     */
    init() {
        this.addGenerateTextButton();
    }

    /**
     * Add generate text button to user editor
     */
    addGenerateTextButton() {
        const leftPanel = document.querySelector('.left-panel');
        if (!leftPanel) return;

        // Find the elements section or create one
        let elementsSection = document.querySelector('.elements-section');
        if (!elementsSection) {
            elementsSection = document.createElement('div');
            elementsSection.className = 'elements-section';
            leftPanel.appendChild(elementsSection);
        }

        // Add AI Text Generator section
        const aiSection = document.createElement('div');
        aiSection.className = 'elements-section';
        aiSection.innerHTML = `
            <div class="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                AI Text Generator
            </div>
            <button class="element-btn" onclick="aiTextUI.openModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    <path d="M12 8v4"/>
                    <circle cx="12" cy="16" r="1"/>
                </svg>
                ✨ Generate Text
            </button>
        `;

        leftPanel.appendChild(aiSection);
    }

    /**
     * Open the AI text generation modal
     */
    openModal() {
        if (this.modal) return;

        const modal = document.createElement('div');
        modal.id = 'aiTextModal';
        modal.className = 'ai-text-modal';
        modal.innerHTML = `
            <div class="ai-modal-overlay" onclick="aiTextUI.closeModal()"></div>
            <div class="ai-modal-container">
                <div class="ai-modal-header">
                    <h3>✨ AI Text Generator</h3>
                    <button class="ai-modal-close" onclick="aiTextUI.closeModal()">×</button>
                </div>
                <div class="ai-modal-body">
                    <div class="ai-config-section">
                        <div class="ai-toggle">
                            <label class="switch">
                                <input type="checkbox" id="useAI" ${this.generator.aiConfig.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                            <span>Use Real AI Generation</span>
                            ${this.generator.aiConfig.enabled ? '<span class="ai-status active">✅ AI Ready</span>' : '<span class="ai-status">⚠️ Setup Required</span>'}
                        </div>
                        ${!this.generator.aiConfig.enabled ? `
                            <button class="config-btn" onclick="aiTextUI.showAIConfig()">
                                ⚙️ Configure AI API
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label>Business Type</label>
                        <select id="businessType" class="ai-select">
                            <option value="">Select your business type...</option>
                            ${this.generator.businessTypes.map(type => 
                                `<option value="${type}">${type}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Special Offer (Optional)</label>
                        <input type="text" id="customOffer" class="ai-input" placeholder="e.g., 50% Off Membership">
                    </div>
                    
                    <div class="form-group">
                        <label>Tone</label>
                        <div class="tone-options">
                            ${this.generator.tones.map(tone => `
                                <label class="tone-option">
                                    <input type="radio" name="tone" value="${tone.value}" ${tone.value === 'professional' ? 'checked' : ''}>
                                    <span>${tone.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="generate-btn" onclick="aiTextUI.generateText()">
                        ${this.generator.aiConfig.enabled ? '🤖 Generate with AI' : '📝 Generate Text'}
                    </button>
                    
                    <div id="loadingState" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>${this.generator.aiConfig.enabled ? 'AI is generating content...' : 'Generating content...'}</p>
                    </div>
                    
                    <div id="resultsContainer" style="display: none;">
                        <div class="results-section">
                            <h4>📝 Headlines</h4>
                            <div id="headlinesList"></div>
                        </div>
                        
                        <div class="results-section">
                            <h4>🎁 Offers</h4>
                            <div id="offersList"></div>
                        </div>
                        
                        <div class="results-section">
                            <h4>🚀 Call to Action</h4>
                            <div id="ctasList"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addModalStyles();
        this.modal = modal;
    }

    /**
     * Add modal styles
     */
    addModalStyles() {
        if (document.getElementById('aiTextModalStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'aiTextModalStyles';
        styles.textContent = `
            .ai-text-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .ai-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .ai-modal-container {
                position: relative;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .ai-modal-header {
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .ai-modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
            }
            
            .ai-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #6b7280;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s;
            }
            
            .ai-modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .ai-modal-body {
                padding: 24px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
            }
            
            .ai-select, .ai-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .ai-select:focus, .ai-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .ai-config-section {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
            }
            
            .ai-toggle {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            
            .switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .slider {
                background-color: #3b82f6;
            }
            
            input:checked + .slider:before {
                transform: translateX(24px);
            }
            
            .ai-status {
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
            }
            
            .ai-status.active {
                background: #dcfce7;
                color: #166534;
            }
            
            .config-btn {
                width: 100%;
                padding: 8px 12px;
                background: #f1f5f9;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 12px;
                color: #374151;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .config-btn:hover {
                background: #e2e8f0;
                border-color: #9ca3af;
            }
            
            .tone-options {
                display: flex;
                gap: 12px;
            }
            
            .tone-option {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                transition: all 0.2s;
            }
            
            .tone-option:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }
            
            .tone-option input[type="radio"] {
                margin: 0;
            }
            
            .tone-option span {
                font-size: 14px;
                color: #374151;
            }
            
            .generate-btn {
                width: 100%;
                padding: 14px 20px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 20px;
            }
            
            .generate-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            
            .generate-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .loading-state {
                text-align: center;
                padding: 40px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .results-container {
                margin-top: 24px;
            }
            
            .results-section {
                margin-bottom: 24px;
            }
            
            .results-section h4 {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .text-suggestion {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }
            
            .text-suggestion:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }
            
            .suggestion-text {
                flex: 1;
                font-size: 14px;
                color: #374151;
                line-height: 1.4;
            }
            
            .apply-btn {
                padding: 6px 12px;
                background: #10b981;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .apply-btn:hover {
                background: #059669;
                transform: translateY(-1px);
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Show AI configuration modal
     */
    showAIConfig() {
        const configModal = document.createElement('div');
        configModal.className = 'ai-text-modal';
        configModal.innerHTML = `
            <div class="ai-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="ai-modal-container" style="max-width: 500px;">
                <div class="ai-modal-header">
                    <h3>⚙️ AI Configuration</h3>
                    <button class="ai-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="ai-modal-body">
                    <div class="form-group">
                        <label>AI Provider</label>
                        <select id="aiProvider" class="ai-select" onchange="aiTextUI.updateProviderFields()">
                            <option value="openai">OpenAI (GPT) - Paid</option>
                            <option value="gemini">Google Gemini - Paid</option>
                            <option value="free">🆓 FREE AI Options</option>
                        </select>
                    </div>
                    
                    <div id="freeProviderOptions" style="display: none;">
                        <div class="form-group">
                            <label>Free Provider</label>
                            <select id="freeProvider" class="ai-select">
                                <option value="groq">Groq (Llama 3) - FREE</option>
                                <option value="huggingface">Hugging Face - FREE</option>
                            </select>
                        </div>
                    </div>
                    
                    <div id="apiKeyField">
                        <div class="form-group">
                            <label>API Key</label>
                            <input type="password" id="apiKey" class="ai-input" placeholder="Enter your API key">
                            <small style="color: #6b7280; font-size: 12px; margin-top: 4px; display: block;">
                                Your API key is stored locally and never shared
                            </small>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="saveKey" checked> Save API key for future use
                        </label>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button class="generate-btn" onclick="aiTextUI.saveAIConfig()">Save Configuration</button>
                        <button class="config-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">How to get API keys:</h4>
                        <div style="font-size: 12px; color: #6b7280; line-height: 1.5;">
                            <strong>OpenAI:</strong> Visit platform.openai.com → API Keys → Create new key<br>
                            <strong>Gemini:</strong> Visit ai.google.dev → Get API Key → Copy key<br>
                            <strong>Groq (FREE):</strong> Visit console.groq.com → API Keys → Create key<br>
                            <strong>Hugging Face (FREE):</strong> Visit huggingface.co → Settings → Access Tokens
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(configModal);
    }

    /**
     * Update provider fields based on selection
     */
    updateProviderFields() {
        const provider = document.getElementById('aiProvider').value;
        const freeOptions = document.getElementById('freeProviderOptions');
        const apiKeyField = document.getElementById('apiKeyField');

        if (provider === 'free') {
            freeOptions.style.display = 'block';
            apiKeyField.style.display = 'block';
        } else {
            freeOptions.style.display = 'none';
            apiKeyField.style.display = 'block';
        }
    }

    /**
     * Save AI configuration
     */
    saveAIConfig() {
        const provider = document.getElementById('aiProvider').value;
        const apiKey = document.getElementById('apiKey').value.trim();
        const saveKey = document.getElementById('saveKey').checked;
        const freeProvider = document.getElementById('freeProvider')?.value || 'groq';

        if (!apiKey) {
            this.showToast('Please enter an API key', 'error');
            return;
        }

        // Configure based on provider
        if (provider === 'free') {
            this.generator.configureAI(apiKey, provider);
            this.generator.aiConfig.freeProvider = freeProvider;
        } else {
            this.generator.configureAI(apiKey, provider);
        }
        
        if (saveKey) {
            this.generator.saveApiKey(apiKey, provider);
            if (provider === 'free') {
                localStorage.setItem('ai_free_provider', freeProvider);
            }
        }

        this.showToast('AI configuration saved successfully!', 'success');
        
        // Close config modal and refresh main modal
        document.querySelector('.ai-text-modal').remove();
        this.closeModal();
        this.openModal();
    }

    /**
     * Generate text content
     */
    async generateText() {
        const businessType = document.getElementById('businessType').value;
        const customOffer = document.getElementById('customOffer').value;
        const tone = document.querySelector('input[name="tone"]:checked')?.value || 'professional';
        const useAI = document.getElementById('useAI')?.checked || false;

        if (!businessType) {
            this.showToast('Please select a business type', 'error');
            return;
        }

        // Show loading state
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'none';

        try {
            // Generate content
            this.generatedContent = await this.generator.generateText(businessType, tone, customOffer, useAI);

            // Hide loading, show results
            document.getElementById('loadingState').style.display = 'none';
            this.displayResults();
        } catch (error) {
            document.getElementById('loadingState').style.display = 'none';
            this.showToast(error.message, 'error');
        }
    }

    /**
     * Display generated results
     */
    displayResults() {
        const resultsContainer = document.getElementById('resultsContainer');
        const headlinesList = document.getElementById('headlinesList');
        const offersList = document.getElementById('offersList');
        const ctasList = document.getElementById('ctasList');

        // Display headlines
        headlinesList.innerHTML = this.generatedContent.headlines.map((headline, index) => `
            <div class="text-suggestion">
                <span class="suggestion-text">${headline}</span>
                <button class="apply-btn" onclick="aiTextUI.applyText('${headline.replace(/'/g, "\\'")}', 'headline')">Apply</button>
            </div>
        `).join('');

        // Display offers
        offersList.innerHTML = this.generatedContent.offers.map((offer, index) => `
            <div class="text-suggestion">
                <span class="suggestion-text">${offer}</span>
                <button class="apply-btn" onclick="aiTextUI.applyText('${offer.replace(/'/g, "\\'")}', 'offer')">Apply</button>
            </div>
        `).join('');

        // Display CTAs
        ctasList.innerHTML = this.generatedContent.ctas.map((cta, index) => `
            <div class="text-suggestion">
                <span class="suggestion-text">${cta}</span>
                <button class="apply-btn" onclick="aiTextUI.applyText('${cta.replace(/'/g, "\\'")}', 'cta')">Apply</button>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';
    }

    /**
     * Apply generated text to canvas
     */
    applyText(text, type) {
        const success = this.generator.applyTextToElement(text);
        if (success) {
            this.showToast('Text applied successfully!', 'success');
            this.closeModal();
        } else {
            this.showToast('Failed to apply text. Please try again.', 'error');
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `ai-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        if (!document.getElementById('aiToastStyles')) {
            const styles = document.createElement('style');
            styles.id = 'aiToastStyles';
            styles.textContent = `
                .ai-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10001;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                .ai-toast.success {
                    border-left: 4px solid #10b981;
                }
                .ai-toast.error {
                    border-left: 4px solid #ef4444;
                }
                .toast-content {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    color: #1f2937;
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .toast-close:hover {
                    color: #374151;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// Create global instance
window.aiTextGenerator = new AITextGenerator();
window.aiTextUI = new AITextGeneratorUI();
