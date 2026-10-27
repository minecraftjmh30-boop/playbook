<template>
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary-subtle">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/">Playbook</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/schedule">Schedule</router-link></li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Huddle</a>
                <ul class="dropdown-menu">
                  <li><router-link class="dropdown-item" to="/create-huddle">Create Huddle</router-link></li>
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#navbarJoinHuddleModal">Join Huddle</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Profile</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" @click.prevent="navigateToProfile('main-tab')" role="button">My Profile</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="navigateToProfile('friends-tab')" role="button">Add Friends</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="navigateToProfile('settings-tab')" role="button">Settings</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="logout" role="button">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="modal fade" id="navbarJoinHuddleModal" tabindex="-1" aria-labelledby="navbarJoinHuddleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-start text-dark">
            <div class="modal-header">
              <h5 class="modal-title" id="navbarJoinHuddleModalLabel">Join a Huddle</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="navbarJoinHuddleForm" @submit.prevent="handleNavbarJoin">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="navbarJoinHuddleCode" class="form-label">Enter Huddle Code</label>
                  <input type="text" class="form-control" id="navbarJoinHuddleCode" v-model="navbarJoinCode" placeholder="e.g. 123" required>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Join</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
</template>

<script>
import { useRouter } from 'vue-router';
import { getCookie } from '../../core/utils.js';

export default {
    name: 'AppHeader',
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            navbarJoinCode: ''
        };
    },
    methods: {
        handleNavbarJoin() {
            if (this.navbarJoinCode && this.navbarJoinCode.trim()) {
                this.router.push({ path: '/huddle', query: { code: this.navbarJoinCode.trim() } });
            }
        },
        navigateToProfile(tab) {
            this.router.push({ path: '/profile', hash: '#' + tab });
        },
        logout() {
            document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            this.router.push('/login');
        }
    }
};
</script>

<style scoped>
.router-link-active {
    font-weight: 700;
}
</style>