<script setup>
import { login } from '@/http/api/user'
const loginAsync = async () => {
	let params = {
		email: '123',
		password: '12321',
	}
	let data = await login(params)
	console.log(data)
}
</script>
