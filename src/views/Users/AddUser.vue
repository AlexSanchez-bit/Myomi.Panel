<template>
  <div class="rounded-lg   overflow-hidden relative">
    <div class="absolute w-full h-full flex justify-center items-center z-10" v-if="loading">
<ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
    <header class=" bg-darkblue text-wood font-albra-serif-bold py-5 text-3xl rounded-t-lg text-center px-4">
      <h1>{{$t('user_creation')}}</h1>
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

<div>

      <FloatLabel class="flex-1">
    <InputText id="passw" class="flex-1" v-model="password.value" :invalid="!password.validity && password.touched"

     @click="password.touched=true" @input="password.touched=true"
    />
    <label for="passw">{{$t('password')}}</label>
</FloatLabel>
    <small class="text-xs text-red-500" v-if="!password_confirm.validity && (password_confirm.touched || password.touched)">{{$t('passwords_dont_match')}}</small>
</div>


<div>
        <FloatLabel class="flex-1">
    <InputText id="passwC" class="flex-1" v-model="password_confirm.value" :invalid="!password_confirm.validity && password_confirm.touched"
     @click="password_confirm.touched=true" @input="password_confirm.touched=true"
    />
    <label for="passwC">{{$t('password_confirm')}}</label>
</FloatLabel>
    <small class="text-xs text-red-500" v-if="!password_confirm.validity && (password_confirm.touched || password.touched)">{{$t('passwords_dont_match')}}</small>

</div>


<div class="flex flex-row gap-5">
  <Button severity="primary" :disabled="!email.validity || !name.validity || !last_name.validity || !password_confirm.validity" icon="pi pi-check" :label="$t('create')" @click="createUser"></Button>
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

import {ref} from 'vue'


const {name,last_name,email,password,password_confirm} = useUserForm()
const {userService} = useUserService();

const emit = defineEmits<{
  (e: 'added') 
}>()

interface Props {
  closeCb: () => void;
}
const props = defineProps<Props>();
const loading=ref(false)


const { closeCb } = props;
async function createUser(){
loading.value=true
   const data = await userService.createUser(name.value,last_name.value,email.value,password.value)
   loading.value=false
   if (data){
      emit('added')
   closeCb()
   }
}
</script>


  <style>
/* Override PrimeVue button styles */
.p-button.p-button-primary {
  background-color: var(--primary-color-grass) !important;
  border-color: var(--primary-color-sea) !important;
  color: var(--primary-color-wood) !important;
}

.p-button.p-button-secondary {
  background-color: var(--secondary-color-darkblue) !important;
  border-color: var(--secondary-color-darkblue) !important;
  color: var(--secondary-color-darkblue) !important;
}
</style>
