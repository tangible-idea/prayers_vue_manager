<template>
  <div id="app">
    <div class="prayers-container">
      <h2>Prayers - {{ roomTag }}</h2>
      <button @click="savePrayers" class="save-button">Save</button>
      
      <div class="prayer-list">
        <div v-for="(prayer, index) in prayers" :key="index" class="prayer-item">
          <div class="prayer-input-group">
            <select 
              v-model="prayer.name" 
              class="name-input"
            >
              <option value="">Select name</option>
              <option v-for="user in roomUsers" :key="user" :value="user">
                {{ user }}
              </option>
            </select>
            <input 
              v-model="prayer.request" 
              placeholder="Prayer Request"
              class="request-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (you'll need to add your own credentials)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'App',
  props: {
    roomTag: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const prayers = ref(Array(10).fill().map(() => ({
      name: '',
      request: ''
    })))
    const roomUsers = ref([])

    const loadRoomUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('kakao_room')
          .select('name')
          .eq('room_tag', props.roomTag)

        if (error) throw error
        if (data) {
          roomUsers.value = data.map(user => user.name)
        }
      } catch (error) {
        console.error('Error loading room users:', error)
      }
    }

    const savePrayers = async () => {
      try {
        const { data, error } = await supabase
          .from('prayer')
          .upsert(
            prayers.value.map(prayer => ({
              name: prayer.name,
              request: prayer.request,
              room_tag: props.roomTag
            }))
          )

        if (error) throw error
        alert('Prayers saved successfully!')
      } catch (error) {
        console.error('Error saving prayers:', error)
        alert('Failed to save prayers. Please try again.')
      }
    }

    // Load existing prayers on mount
    onMounted(async () => {
      await loadRoomUsers()
      try {
        const { data, error } = await supabase
          .from('prayer')
          .select('*')
          .eq('room_tag', props.roomTag)
          .limit(10)

        if (error) throw error
        if (data && data.length > 0) {
          prayers.value = data
        }
      } catch (error) {
        console.error('Error loading prayers:', error)
      }
    })

    return {
      prayers,
      roomUsers,
      savePrayers
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.prayers-container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
}

.save-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}

.prayer-list {
  margin-top: 20px;
}

.prayer-item {
  margin-bottom: 15px;
}

.prayer-input-group {
  display: flex;
  gap: 10px;
}

.name-input {
  width: 150px;
}

.request-input {
  flex-grow: 1;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

select:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>
