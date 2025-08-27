export default () => ({
    database: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    adminKeyPath: process.env.ADMIN_KEY_PATH
})