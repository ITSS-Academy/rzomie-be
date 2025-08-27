import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import configuration from 'src/config/configuration';

@Injectable()
export class SupabaseService {

    private readonly supabaseClient: SupabaseClient
    
    constructor() {
        this.supabaseClient = new SupabaseClient(
            configuration().database.supabaseUrl!,
            configuration().database.supabaseAnonKey!
        );
    }

    get supabase(): SupabaseClient {
        return this.supabaseClient;
    }
}
