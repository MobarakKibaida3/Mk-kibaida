async function testEndpoints() {
  const baseUrl = 'http://localhost:3000';

  console.log('=== 2. TESTING CALCULATOR API ENDPOINTS ===');

  // Test 1: GET /api/calculator/pricing
  const pricingRes = await fetch(`${baseUrl}/api/calculator/pricing`);
  const pricingData = await pricingRes.json();
  if (pricingRes.ok && pricingData.rules && pricingData.rules.length >= 7) {
    console.log(`✓ PASS: GET /api/calculator/pricing returned ${pricingData.rules.length} service rules`);
  } else {
    throw new Error(`FAIL: Pricing API failed with status ${pricingRes.status}`);
  }

  // Test 2: POST /api/calculator/estimate
  const estimateRes = await fetch(`${baseUrl}/api/calculator/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceId: 'website-design-dev',
      unitsCount: 5,
      featureIds: ['multilingual-support', 'advanced-seo-setup'],
      complexityId: 'standard',
      currency: 'EGP',
    }),
  });
  const estData = await estimateRes.json();
  if (estimateRes.ok && estData.success && estData.breakdown.estimatedTotal > 0) {
    console.log('✓ PASS: POST /api/calculator/estimate calculated authoritative breakdown:', {
      total: estData.breakdown.estimatedTotal,
      currency: estData.breakdown.currency,
      base: estData.breakdown.basePrice,
      unitsCost: estData.breakdown.unitsCost,
    });
  } else {
    throw new Error(`FAIL: Estimate API failed: ${JSON.stringify(estData)}`);
  }

  // Test 3: POST /api/calculator/request (Custom Quotation submission)
  const quoteReqRes = await fetch(`${baseUrl}/api/calculator/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'خالد عبد الله السالم',
      phone: '0509876543',
      countryCode: '+966',
      email: 'khaled.salem@example.com',
      serviceId: 'automation-integrations',
      pricingModeSelected: 'quotation',
      budgetRange: '10,000 - 15,000 ريال',
      preferredDeadline: 'خلال 3 أسابيع',
      specialRequirements: 'ربط متجر شوبيفاي مع نظام زوهو سي آر إم وتطبيق واتساب للأعمال لإرسال إشعارات الشحن تلقائياً.',
      currency: 'SAR',
    }),
  });
  const quoteReqData = await quoteReqRes.json();
  if (quoteReqRes.ok && quoteReqData.success && quoteReqData.order.orderCode.startsWith('MK-Q')) {
    console.log('✓ PASS: Custom Quotation submitted successfully with tracking code:', quoteReqData.order.orderCode);
    console.log('  isQuotation flag:', quoteReqData.isQuotation);
    console.log('  WhatsApp generated URL exists:', Boolean(quoteReqData.whatsappUrl));
  } else {
    throw new Error(`FAIL: Quotation request submission failed: ${JSON.stringify(quoteReqData)}`);
  }

  console.log('=== ALL API ENDPOINT TESTS PASSED! ===');
}

testEndpoints().catch(err => {
  console.error('API test failed:', err);
  process.exit(1);
});
