<script setup lang="ts">
const props = defineProps<{
  src: string
  placeholder: string
}>()

const imageContainer = ref()

onMounted(() => {
  const placeholderImg = new Image()
  placeholderImg.style.borderRadius = "2px"
  placeholderImg.src = "/placeholder.jpeg"

  const image = new Image()
  // avoid layout shift when image is appended to the DOM but not loadeded
  image.style.position = "absolute"
  image.style.borderRadius = "2px"
  image.loading = "lazy"

  imageContainer.value.appendChild(placeholderImg)

  placeholderImg.onload = () => {
    image.src = props.src
    imageContainer.value.appendChild(image)

    image.onload = () => {
      image.style.position = "static"
      imageContainer.value.removeChild(placeholderImg)
    }

    image.onerror = () => {
      imageContainer.value.removeChild(image)
    }
  }
})
</script>

<template>
  <div ref="imageContainer"></div>
</template>
