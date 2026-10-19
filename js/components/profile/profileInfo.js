const ProfileInfo = {
    name: 'ProfileInfo',
    props: {
        userInfo: {
            type: Object,
            default: () => ({ name: '', email: '', dateJoined: '' })
        }
    },
    template: `
    <div class="card">
        <div class="card-header">Profile Information</div>
        <div class="card-body">
            <p><strong class="me-2">Name:</strong> {{ userInfo.name }}</p>
            <p><strong class="me-2">Email:</strong> {{ userInfo.email }}</p>
            <p><strong class="me-2">Date Joined:</strong> {{ userInfo.dateJoined }}</p>
        </div>
    </div>
    `
};
