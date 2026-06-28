import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          display_name: string
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string
        }
        Update: {
          display_name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: number
          title: string
          content: string
          category: string
          image_url: string | null
          created_at: string
          published: boolean
          user_id: string | null
        }
        Insert: {
          title: string
          content?: string
          category?: string
          image_url?: string | null
          published?: boolean
          user_id?: string | null
        }
        Update: {
          title?: string
          content?: string
          category?: string
          image_url?: string | null
          published?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          id: number
          title: string
          description: string | null
          image_url: string
          album: string
          taken_at: string | null
          created_at: string
          user_id: string | null
          media_type: 'image' | 'video'
        }
        Insert: {
          title: string
          description?: string | null
          image_url: string
          album?: string
          taken_at?: string | null
          user_id?: string | null
          media_type?: 'image' | 'video'
        }
        Update: {
          title?: string
          description?: string | null
          image_url?: string
          album?: string
          taken_at?: string | null
          user_id?: string | null
          media_type?: 'image' | 'video'
        }
        Relationships: []
      }
      hero_media: {
        Row: {
          id: number
          title: string
          media_url: string
          media_type: 'image' | 'video'
          storage_path: string
          display_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          title?: string
          media_url: string
          media_type?: 'image' | 'video'
          storage_path?: string
          display_order?: number
          active?: boolean
        }
        Update: {
          title?: string
          media_url?: string
          media_type?: 'image' | 'video'
          storage_path?: string
          display_order?: number
          active?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
