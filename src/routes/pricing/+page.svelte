<script lang="ts">
    import {onMount} from 'svelte';

    onMount(() =>{
        const stripeScript = document.createElement('script');
        stripeScript.src = "https://js.stripe.com/v3/pricing-table.js";
        stripeScript.async = true;
        document.head.appendChild(stripeScript);
    });
</script>

<svelte:head>
    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<main class="container">
    <h1 class="heading">Subscribe to Pro Version of AresChat</h1>
    <stripe-pricing-table
            pricing-table-id="prctbl_1NEw6qCeOmHmmUSp1et4tEvt"
            publishable-key="pk_live_51MaJ2zCeOmHmmUSp1kz92q40YXmh6ZZrsqcQ1PjEyHMU8yAQzY8wEV7jT0Uoc9LMOMyyJT59ZAOiqAjMnLkxPHVm00gq2FTFfD"
    >

    </stripe-pricing-table>
</main>


<style>
    /* Appliquer le style pour centrer les éléments */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh; /* Assurez-vous que la hauteur de l'écran est couverte par le conteneur */
    }

    /* Appliquer le style pour le texte <h1> en gras */
    .heading {
        font-weight: bold;
    }
</style>