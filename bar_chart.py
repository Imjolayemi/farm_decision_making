import matplotlib.pyplot as plt

# Sample data
Dates = ['2024/10/28', 'Category B', 'Category C', 'Category D']
Temperature = [4, 7, 1, 8]

# Create the Bar Chart
plt.line(Dates, Temperature, color=['red', 'green', 'blue', 'purple'])

# Customize the Chart
plt.title('Akure Weather Temperature in kelvin(K) for Different Dates')
plt.xlabel('Dates')
plt.ylabel('Temperature')

# Display the Chart
plt.show()
