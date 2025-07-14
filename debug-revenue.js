async function debugRevenue() {
  try {
    // Đăng nhập để lấy token
    const loginResponse = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'trietcrt.pnc@gmail.com',
        password: '123123123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful');
    console.log('🔑 Token:', token.substring(0, 50) + '...');

    // Test revenue debug API
    const debugResponse = await fetch('http://localhost:3000/api/payments/revenue/debug', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Debug API Status:', debugResponse.status);
    console.log('📡 Debug API Headers:', debugResponse.headers);

    const debugData = await debugResponse.json();
    console.log('\n📄 RAW RESPONSE:');
    console.log(JSON.stringify(debugData, null, 2));
    
    console.log('\n🔍 REVENUE DEBUG RESULTS:');
    console.log('=====================================');
    console.log(`Total Orders: ${debugData.debug.totalOrders}`);
    console.log(`Completed Orders: ${debugData.debug.completedOrders}`);
    console.log(`Success Payments: ${debugData.debug.successPayments}`);
    console.log(`Current Revenue Calculation: ${debugData.debug.currentRevenueCalculation}`);
    console.log(`Manual Revenue Calculation: ${debugData.debug.manualRevenueCalculation}`);

    console.log('\n📋 ALL ORDERS DETAILS:');
    debugData.debug.allOrdersDetails.forEach(order => {
      console.log(`Order ${order.id}: ${order.status} - ${order.amount} - User: ${order.user}`);
      order.payments.forEach(payment => {
        console.log(`  Payment ${payment.id}: ${payment.status} - ${payment.gateway} - ${payment.txn_code}`);
      });
    });

    console.log('\n💰 SUCCESS PAYMENTS DETAILS:');
    debugData.debug.successPaymentsDetails.forEach(payment => {
      console.log(`Payment ${payment.id}: Order ${payment.order_id} - ${payment.status} - ${payment.gateway} - Amount: ${payment.order_amount}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugRevenue(); 