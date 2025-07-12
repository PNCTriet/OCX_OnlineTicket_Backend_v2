const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Read the SQL seed file
        const seedSQL = fs.readFileSync(path.join(__dirname, '../prisma/seed.sql'), 'utf8');
        
        // Parse SQL statements more intelligently
        const statements = parseSQLStatements(seedSQL);

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    await prisma.$executeRawUnsafe(statement);
                    console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
                } catch (error) {
                    console.error(`❌ Error executing statement ${i + 1}:`, error.message);
                    console.error(`Statement: ${statement.substring(0, 100)}...`);
                    // Continue with other statements
                }
            }
        }

        console.log('🎉 Database seeding completed successfully!');
        
        // Display summary
        const summary = await getSummary();
        console.log('\n📊 Database Summary:');
        console.log(`👥 Users: ${summary.users}`);
        console.log(`🏢 Organizations: ${summary.organizations}`);
        console.log(`🎪 Events: ${summary.events}`);
        console.log(`🎫 Tickets: ${summary.tickets}`);
        console.log(`🛒 Orders: ${summary.orders}`);
        console.log(`💳 Payments: ${summary.payments}`);
        console.log(`📧 Email Logs: ${summary.emailLogs}`);
        console.log(`🔗 Webhook Logs: ${summary.webhookLogs}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

function parseSQLStatements(sql) {
    // Remove comments
    let cleanedSQL = sql.replace(/--.*$/gm, '');
    
    // Split by semicolons and filter out empty statements
    const statements = cleanedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
    
    return statements;
}

async function getSummary() {
    const [
        users,
        organizations,
        events,
        tickets,
        orders,
        payments,
        emailLogs,
        webhookLogs
    ] = await Promise.all([
        prisma.user.count(),
        prisma.organization.count(),
        prisma.event.count(),
        prisma.ticket.count(),
        prisma.order.count(),
        prisma.payment.count(),
        prisma.emailLog.count(),
        prisma.webhookLog.count()
    ]);

    return {
        users,
        organizations,
        events,
        tickets,
        orders,
        payments,
        emailLogs,
        webhookLogs
    };
}

// Run the seeding
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase }; 