import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test the connection by checking if we can access Supabase
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      connected: true
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to Supabase'
    }, { status: 500 })
  }
}
