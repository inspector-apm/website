---
title: "Vue.js state management with Pinia"
slug: "vue-js-state-management-with-pinia"
section: "inspector"
permalink: "/vue-js-state-management-with-pinia/"
original_url: "https://inspector.dev/vue-js-state-management-with-pinia/"
date: "2023-05-24T15:05:45Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["javascript", "software development", "ui", "vuejs"]
description: "In this tutorial, we will explore the core concepts of Pinia, and how to effectively use it in your Vue.js projects for state management."
focus_keyword: "Vue.js state management"
featured_image: "../images/vue-js-state-management-with-pinia/featured.png"
wp_id: 5755
---

State management is a crucial aspect of any Vue.js application, as it helps in managing and sharing data between components efficiently. Pinia is a state management library specifically designed for Vue.js 3 applications, providing a simple and scalable solution for managing application state.

This article is part of our knowledge sharing process as we are currently working on the refactoring of the Inspector dashboard that is a Vuejs application. So moving from Vuejs 2 to Vuejs 3 we had to [**leave Webpack and embrace Vite**](/how-to-make-vite-hot-module-replacement-work-on-windows/), and replace a lot of dependencies like the state management library (from Vuex to [**Pinia**](https://pinia.vuejs.org/)).

In this tutorial, we will explore the core concepts and features of Pinia, and demonstrate how to effectively use it in your Vue.js projects.

## What State Management means?

In simple terms, state management refers to the management and organization of data within a Vue.js application. It involves keeping track of the application's data and ensuring that different components can access and update this data in a consistent and efficient manner.

In Vue.js applications, components are responsible for rendering different parts of the user interface. However, components often need to read and manipulate the same piece of data of other components. This is where state management comes in.

By using a state management library like Pinia, you can centralize your application's data in a separate entity called a store. The store acts as a single source of truth for your data, and components can access this data from the store whenever they need it. This decouples the data from individual components and allows for better organization and sharing of data across the application.

State management brings several benefits to the development of a Vue.js application:

**Centralized Data**: By storing data in a centralized store, you avoid the need to pass data between components manually. Components can simply access the store to retrieve the required data, making it easier to maintain and update.

**Shared State**: Components can share the same state stored in the store. This means that when one component modifies the state, other components automatically receive the updated data. It promotes consistency across the application and reduces the likelihood of data inconsistencies.

**Reactive Updates**: Vue.js is known for its reactivity system, which means that when the state in the store changes, all components relying on that state will be automatically updated to reflect the changes. This simplifies the process of keeping the UI up-to-date and in sync with the underlying data.

Overall, state management simplifies data handling, promotes code reusability, improves maintainability, and enhances the overall architecture of your Vue.js application. It helps you build robust and scalable applications while ensuring that data is managed consistently across components.

## Installing Pinia

To start using Pinia, we need to install it as a dependency in our project. Open your terminal and run the following command:

```bash
npm install pinia
```

## Creating a Store

A store in Pinia represents a centralized container of data. It holds the application state, provides methods to access and modify the state, and also allows defining actions and getters.

Create a new file named **store.js** and define a Pinia store using the **defineStore** function:

```javascript
import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'myStore',

  state: () => ({
    // Define your state properties here
  }),

  getters: {
    // Define your getters here
  },

  actions: {
    // Define your actions here
  },
});
```

In this example, we have defined a store with an ID of '**myStore**'. Replace '**myStore**' with a meaningful name for your store.

## Defining State, Getters, Actions, and Mutations

Inside the store definition, we can define the store's state, getters, actions, and mutations.

State represents the data that needs to be managed by the store. It can be defined as a function that returns an object representing the initial state of the store. For example:

```javascript
state: () => ({
  todos: [],
}),
```

Getters are functions that compute derived state based on the store's state. They are similar to computed properties in Vue components. Here's an example:

```javascript
getters: {
  todoCount: (state) => state.todos.length,
},
```

Actions are responsible for performing operations against the state. They can be defined as functions inside the **actions** object. For example:

```javascript
actions: {
  async fetchTodos() {

    try {
      // Fetch todos from an API
      const response = await fetch('https://api.example.com/todos');
      this.todos = await response.json();
    } catch (error) {
      return error;
    }
  },
},
```

As you can see the above code example, you can access the state of the store by the keyword "**this**" inside an action function to apply changes eventually.

## Accessing Store in Components

To use the Pinia store in a component, we need to import the **useStore** function and invoke it.

In the example below, we import the **useStore** function from our store file and invoke it to get access to the store instance. We then use the store properties and methods in the component's **setup()** function.

```javascript
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from './store';

export default {
  setup() {
    const store = useStore();
    
    return {
      count: store.count,
      increment: store.increment,
    };
  },
};
</script>
```

## A practical example of state sharing between components

Let's consider an example where we have two Vue.js Single File Components (SFCs): **ParentComponent.vue** and **ChildComponent.vue**. I'll show you how to share state between these components using a state management library like Pinia.

```javascript title="ParentComponent.vue"
<template>
  <div>
    <h1>Parent Component</h1>
    <input v-model="message" placeholder="Enter a message" />
    <p>Message from child component: {{ childMessage }}</p>
    <ChildComponent :parentMessage="message" />
  </div>
</template>

<script>
import { useStore } from './store';
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent,
  },

  setup() {
    const store = useStore();
    
    return {
      message: store.message,
      childMessage: store.childMessage,
    };
  },
};
</script>
```

In this example, the parent component has an input field that allows the user to enter a message. The **message** property is accessed from the store, allowing the parent component to share its state.

In the child component, we will receive the `parentMessage` prop and display it.

```javascript title="ChildComponent.vue"
<template>
  <div>
    <h2>Child Component</h2>
    <p>Parent Message: {{ parentMessage }}</p>
    <button @click="updateParentMessage">Update Parent Message</button>
  </div>
</template>

<script>
import { useStore } from './store';

export default {
  props: {
    parentMessage: String,
  },
  setup(props) {
    const store = useStore();
    
    const updateParentMessage = () => {
      store.updateMessage('Updated message from child');
    };
    
    return {
      parentMessage: props.parentMessage,
      updateParentMessage,
    };
  },
};
</script>
```

In the child component, we receive the **parentMessage** prop from the parent component and display it. We also have a button that triggers an action to update the parent message in the store.

We define the Pinia store with the **message** property and an action to update the message.

```javascript title="store.js"
import { defineStore } from 'pinia';

export const useStore = defineStore({
  state: () => ({
    message: '',
    childMessage: '',
  }),

  actions: {
    updateMessage(newMessage) {
      this.message = newMessage;
      this.childMessage = `Child component updated the message: ${newMessage}`;
      });
    },
  },
});
```

By following this example, the **ParentComponent.vue** and **ChildComponent.vue** will share the message state. Whenever the user enters a message in the parent component, it will be displayed in the child component, and clicking the "Update Parent Message" button in the child component will trigger an action that updates the message in both the parent and child components.
