import matplotlib.pyplot as plt

# Sample data
categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = [4, 7, 1, 8]

# Step 3: Create the Pie Chart
plt.pie(values, labels=categories, autopct='%1.1f%%', colors=['lightblue', 'lightgreen', 'lightcoral', 'gold'])

# Step 4: Customize the Chart
plt.title('Sample Pie Chart')

# Step 5: Display the Chart
plt.show()
