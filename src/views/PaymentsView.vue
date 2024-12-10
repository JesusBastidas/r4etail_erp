<template>
  <div class="payment-page bg-gray-100 p-4 md:p-8 flex justify-center items-center h-[100vh]">
    <div class="flex flex-col md:flex-row w-full md:w-3/4 justify-between p-4 rounded-lg shadow-2xl">
      <!-- Formulario -->
      <form @submit.prevent="submitPayment" class="space-y-1 p-6 rounded-lg w-full md:w-3/4 shadow-2xl mb-4 md:mb-0 max-w-md">
        <h1 class="text-4xl font-bold mb-4 text-center text-green-900">Payment Record</h1>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="tree_quantity">
            Select the number of trees
          </label>
          <input type="number" id="tree_quantity" v-model.number="treeQuantity" placeholder="tree_quantity" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" min="0" />
        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="firstName">
            Name
          </label>
          <input type="text" v-model="firstName" placeholder="First Name" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" />
        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="lastName">
            Last name
          </label>
          <input type="text" v-model="lastName" placeholder="Last Name" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" />
        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="email">
            E-mail address
          </label>
          <input type="email" v-model="email" placeholder="Email" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" :class="{ 'border-red-500': !isValidEmail && email !== '' }" />
          <p v-if="!isValidEmail && email !== ''" class="text-red-500 text-xs italic">Por favor, introduce un correo electrónico válido.</p>

        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="phone">
            Phone
          </label>
          <input type="text" v-model="phone" placeholder="Phone" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" />
        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="documentNumber">
            Document number
          </label>
          <input type="text" v-model="documentNumber" placeholder="Document Number" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-8" />
        </div>

        <div class="flex flex-col mb-4">
          <label class="text-lg font-bold mb-1 text-green-900" for="documentType">
            Type of document
          </label>
          <select v-model="documentType" class="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-900 h-9">
            <option value="CC">Citizenship Card</option>
            <option value="TI">Identity Card</option>
            <option value="CE">Foreigner Identification Card</option>
            <option value="PP">Passport</option>
            <option value="PP">Nit</option>

          </select>
        </div>

        <div class="flex justify-between items-center mt-6">
          <button type="submit" class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
            Register
          </button>

          <!-- Botón de ePayco -->
          <div id="epayco-button"></div>
        </div>
      </form>
      <!-- Logo -->
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center">
        <img src="@/assets/treeoma.svg" alt="Logo" class="w-full md:w-1/2">
      </div>
      <div>

      </div>
    </div>
  </div>
</template>
  <script setup>
  import { onMounted, ref, computed } from 'vue';

  const treeQuantity = ref(1);
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const phone = ref('');
  const documentNumber = ref('');
  const documentType = ref('CC');

  const isValidEmail = computed(() => {
    if (email.value === '') {
      return true;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.value.toLowerCase());
  });

  async function submitPayment() {
    const payload = {
      tree_quantity: treeQuantity.value,
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      phone: phone.value,
      document_type: documentType.value,
      document_number: documentNumber.value,
      currency: "COP",
      dues: 8
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL+'/paidpurchase/payments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Payment info:', data);
      updateEpaycoButton(data);
      alert('Record processed correctly!');
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Error in the registration process, check your details...');
    }
  }

  function updateEpaycoButton(data) {
    document.getElementById('epayco-button').innerHTML = ''; // Clear previous script if any
    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.className = 'epayco-button';
    script.setAttribute('data-epayco-key', '218bcdf4a9f5df044b14d624c47f019c');
    script.setAttribute('data-epayco-amount', data.total_price.toString());
    script.setAttribute('data-epayco-tax', data.tax ? data.tax.toString() : '0.00');
    script.setAttribute('data-epayco-tax-base', data.total_price.toString());
    script.setAttribute('data-epayco-name', data.plan_name);
    script.setAttribute('data-epayco-description', data.plan_name);
    script.setAttribute('data-epayco-currency', 'cop');
    script.setAttribute('data-epayco-country', 'CO');
    script.setAttribute('data-epayco-test', 'true');
    script.setAttribute('data-epayco-language', 'ES');
    script.setAttribute('data-epayco-confirmation', import.meta.env.VITE_API_URL +'/paidpurchase/epayco-confirmation/');
    document.getElementById('epayco-button').appendChild(script);
  }

  onMounted(() => {
    // Placeholder if needed
  });
  </script>
