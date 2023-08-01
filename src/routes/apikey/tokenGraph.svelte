<script>
    import { onMount } from 'svelte';
    import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
  
    // Register the required chart controllers and elements
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
  
    let chartInstance;
  
    // Define the options object separately
    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Token Usage',
          font: {
            size: 20,
            weight: 'bold',
          },
          color: 'white',
          padding: { top: 10, bottom: 10 },
        },
      },
      // Other chart options...
    };
  
    onMount(() => {
      const canvas = document.getElementById('myChart');
      const ctx = canvas.getContext('2d');
  
      const config = {
        type: 'line',
        data: {
          labels: ['Date Sample', 'Date Sample', 'Date Sample'],
          datasets: [
            {
              label: 'Data',
              data: [1200, 2000, 1230],
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: chartOptions,
      };
  
      chartInstance = new Chart(ctx, config);
    });
  </script>
  
  <canvas id="myChart" style="height: 200px; box-sizing: border-box; width: 695px; margin:100px 0px 0px 0px;"></canvas>
  