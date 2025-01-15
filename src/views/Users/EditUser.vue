<template>
  <div class="rounded-lg   overflow-hidden relative">
    <div class="absolute w-full h-full flex justify-center items-center z-10" v-if="loading">
<ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <header class=" bg-darkblue text-wood font-albra-serif-bold py-5 text-3xl rounded-t-lg text-center px-4">
      <h1>{{$t('user_edition')}}</h1>
    </header>
    <div class="flex flex-col gap-6 p-5 px-11 bg- items-center text-brick">



      <FloatLabel class="flex-1">
    <InputText id="username" class="flex-1" v-model="name.value"  :invalid="!name.validity && name.touched" onclick="name.touched=true" @input="name.touched=true" />
    <label for="username">{{$t('name')}}</label>
</FloatLabel>



      <FloatLabel class="flex-1">
    <InputText id="last_name" class="flex-1" v-model="last_name.value" :invalid="!last_name.validity && last_name.touched"
     @click="last_name.touched=true" @input="last_name.touched=true"
    />
    <label for="last_name">{{$t('last_name')}}</label>
</FloatLabel>

      <FloatLabel class="flex-1">
    <InputText id="email" class="flex-1" v-model="email.value" :invalid ="!email.validity && email.touched"

     @click="email.touched=true" @input="email.touched=true"
    />
    <label for="email">{{$t('email')}}</label>
</FloatLabel>


<div class="flex flex-row gap-5">
  <Button severity="primary" :disabled="!email.validity || !name.validity || !last_name.validity " icon="pi pi-check" :label="$t('edit')" @click="editUser"></Button>
  <Button severity="secondary" :label="$t('cancel')" @click="closeCb"></Button>
</div>

    </div>
  </div class="p-10">
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext';

import {useUserForm} from './composables/useUserForm'
import {useUserService} from './composables/useUserService'

import {type UserData} from './entity/UserData'

import {ref} from 'vue'

interface Props{
    user_info:UserData
    closeCb: () => void;
}

const props = defineProps<Props>();

const {user_info,closeCb} = props;
console.log(user_info)

const {name,last_name,email} = useUserForm(
  user_info.name,
  user_info.last_name ,
  user_info.email ,
)
const {userService} = useUserService();

const emit = defineEmits<{
  (e: 'edited') 
}>()

const loading=ref(false)


async function editUser(){
loading.value=true
   const error = await userService.editUser(user_info.id,name.value,last_name.value,email.value)
   loading.value=false
   if (!error){
      emit('edited')
      closeCb()
   }
}
</script>


