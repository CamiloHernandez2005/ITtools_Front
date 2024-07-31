<script>
import { registerUser, authService } from '@/service/AuthService';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';

export default {
  components: {
    InputText,
    Button,
    Checkbox,
    DataTable,
    Column,
    Dialog
  },
  data() {
    return {
      user: {
        email: '',
        password: '',
        full_name: '',
        charge: '',
        area: '',
        phone: '',
        status: true
      },
      roles: ['USER', 'ADMIN'],
      selectedRoles: [],
      error: '',
      users: [],
      isEditDialogVisible: false,
      editUserData: {
        email: '',
        password: '',
        full_name: '',
        charge: '',
        area: '',
        phone: '',
        roles: []
      },
      displayConfirmation: false,
      userToChangeStatus: null,
      isActivating: false
    };
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async registerUser() {
      try {
        this.user.roles = this.selectedRoles;
        await registerUser(this.user);
        alert('User registered successfully');
        await this.loadUsers();
        this.resetForm();
      } catch (err) {
        this.error = err.message || 'Registration failed';
      }
    },
    async loadUsers() {
      try {
        this.users = await authService.getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    resetForm() {
      this.user = {
        email: '',
        password: '',
        full_name: '',
        charge: '',
        area: '',
        phone: '',
        status: true
      };
      this.selectedRoles = [];
    },
    editUser(user) {
      this.editUserData = { ...user, roles: [...user.roles] };
      this.isEditDialogVisible = true;
    },
    async updateUser() {
      try {
        await authService.updateUser(this.editUserData);
        alert('User updated successfully');
        await this.loadUsers();
        this.isEditDialogVisible = false;
      } catch (err) {
        this.error = err.message || 'Update failed';
      }
    },
    openConfirmation(user, isActivating) {
      this.userToChangeStatus = user;
      this.isActivating = isActivating;
      this.displayConfirmation = true;
    },
    async changeUserStatus() {
      try {
        const updatedUser = { ...this.userToChangeStatus, status: this.isActivating };
        await authService.updateUser(updatedUser);
        alert(`User ${this.isActivating ? 'activated' : 'deactivated'} successfully`);
        await this.loadUsers();
        this.displayConfirmation = false;
        this.userToChangeStatus = null;
      } catch (err) {
        this.error = err.message || 'Status change failed';
      }
    },
    closeConfirmation() {
      this.displayConfirmation = false;
      this.userToChangeStatus = null;
    },
    resetEditForm() {
      this.editUserData = {
        email: '',
        password: '',
        full_name: '',
        charge: '',
        area: '',
        phone: '',
        roles: []
      };
    }
  }
};
</script>

<template>
  <div class="flex flex-col h-screen p-4">
    <!-- Contenedor de formulario y roles -->
    <div class="flex flex-col md:flex-row gap-8 mb-4">
      <!-- Formulario de registro -->
      <div class="md:w-1/2">
        <div class="card p-4 flex flex-col gap-4">
          <div class="font-semibold text-xl">Create Users</div>
          <form @submit.prevent="registerUser">
            <div class="flex flex-wrap gap-4">
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="email1">Email</label>
                <InputText id="email1" type="email" v-model="user.email" class="p-inputtext-sm" required />
              </div>
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="password">Password</label>
                <InputText id="password" type="password" v-model="user.password" class="p-inputtext-sm" required />
              </div>
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="full_name">Full Name</label>
                <InputText id="full_name" type="text" v-model="user.full_name" class="p-inputtext-sm" />
              </div>
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="charge">Charge</label>
                <InputText id="charge" type="text" v-model="user.charge" class="p-inputtext-sm" />
              </div>
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="area">Area</label>
                <InputText id="area" type="text" v-model="user.area" class="p-inputtext-sm" />
              </div>
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="phone">Phone</label>
                <InputText id="phone" type="text" v-model="user.phone" class="p-inputtext-sm" />
              </div>
            </div>
            <Button type="submit" label="Register" class="p-button-primary mt-3" />
            <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
          </form>
        </div>
      </div>

      <!-- Sección de roles -->
      <div class="md:w-1/2">
        <div class="card p-4 flex flex-col gap-4">
          <div class="font-semibold text-xl">Roles</div>
          <div class="flex flex-col gap-2">
            <div v-for="role in roles" :key="role" class="flex items-center">
              <Checkbox
                :id="role"
                :value="role"
                v-model="selectedRoles"
                class="mr-2"
              />
              <label :for="role">{{ role }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

   <!-- DataTable de usuarios -->
<div class="flex-1 overflow-auto">
  <div class="card p-4 flex flex-col gap-4 h-full">
    <div class="font-semibold text-xl">Users</div>
    <div class="overflow-x-auto">
      <DataTable :value="users" class="p-datatable-sm">
        <Column field="email" header="Email" />
        <Column field="full_name" header="Full Name" />
        <Column field="charge" header="Charge" />
        <Column field="area" header="Area" />
        <Column field="phone" header="Phone" />
        <Column field="roles" header="Roles">
          <template #body="{ data }">
            <span>{{ data.roles.join(', ') }}</span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span :class="data.status ? 'text-green-500' : 'text-red-500'">{{ data.status ? 'Active' : 'Inactive' }}</span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button 
                :icon="data.status ? 'pi pi-power-off' : 'pi pi-power-off'" 
                :class="data.status ? 'p-button-rounded p-button-danger p-button-text' : 'p-button-rounded p-button-success p-button-text'"
                @click="openConfirmation(data, !data.status)"
              />
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-info p-button-text" 
              @click="editUser(data)" 
            />
          </template>
        </Column>
      </DataTable>
      
    </div>
  </div>
</div>


    <!-- Modal de edición de usuario -->
    <Dialog header="Edit User" v-model:visible="isEditDialogVisible" modal :footer="editDialogFooter">
      <div class="flex flex-col gap-4">
        <form @submit.prevent="updateUser">
          <div class="flex flex-wrap gap-4">
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_email">Email</label>
              <InputText id="edit_email" type="email" v-model="editUserData.email" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_password">Password</label>
              <InputText id="edit_password" type="password" v-model="editUserData.password" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_full_name">Full Name</label>
              <InputText id="edit_full_name" type="text" v-model="editUserData.full_name" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_charge">Charge</label>
              <InputText id="edit_charge" type="text" v-model="editUserData.charge" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_area">Area</label>
              <InputText id="edit_area" type="text" v-model="editUserData.area" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label for="edit_phone">Phone</label>
              <InputText id="edit_phone" type="text" v-model="editUserData.phone" class="p-inputtext-sm" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
              <label>Roles</label>
              <div v-for="role in roles" :key="role" class="flex items-center">
                <Checkbox
                  :id="'edit_' + role"
                  :value="role"
                  v-model="editUserData.roles"
                  class="mr-2"
                />
                <label :for="'edit_' + role">{{ role }}</label>
              </div>
            </div>
          </div>
          <Button type="submit" label="Update" class="p-button-primary mt-3" />
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
        </form>
      </div>
    </Dialog>

    <!-- Modal de confirmación -->
    <Dialog header="Confirmation" v-model:visible="displayConfirmation" modal>
      <div class="flex flex-col gap-4">
        <p>Are you sure you want to {{ isActivating ? 'activate' : 'deactivate' }} this user?</p>
        <div class="flex gap-4">
          <Button label="Yes" icon="pi pi-check" class="p-button-success" @click="changeUserStatus" />
          <Button label="No" icon="pi pi-times" class="p-button-danger" @click="closeConfirmation" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
