<script setup lang="ts">
const { program } = useAttendance()
</script>

<template>
  <footer
    class="border-t border-default "
    :class="{ 'hidden sm:block': program }"
  >
    <UContainer class="flex flex-col lg:flex-row items-center justify-between gap-6 py-8 text-sm text-muted">
      <div class="flex items-center gap-3">
        <img
          src="/img/avatar.png"
          alt="محمد عبدالرحمن"
          width="36"
          height="36"
          class="size-9 rounded-full object-cover ring-2 ring-primary/30"
        >
        <p>برمجة وتصميم <span class="font-semibold text-default">محمد عبدالرحمن</span></p>
      </div>
      <div class="w-full lg:max-w-none">
        <UMarquee>
          <UButton
            :ui="{ leadingIcon: 'size-5 lg:size-7 shrink-0' }"
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-github"
            class="size-6 lg:size-8 shrink-0"
            target="_blank"
            to="https://github.com/sh3boo6"
          />
          <UButton
            :ui="{ leadingIcon: 'size-5 lg:size-7 shrink-0' }"
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-x"
            class="size-6 lg:size-8 shrink-0"
            target="_blank"
            to="https://twitter.com/sh3boo6"
          />
          <UButton
            :ui="{ leadingIcon: 'size-5 lg:size-7 shrink-0' }"
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-instagram"
            class="size-6 lg:size-8 shrink-0"
            target="_blank"
            to="https://instagram.com/sh3boo61"
          />
          <UButton
            :ui="{ leadingIcon: 'size-5 lg:size-7 shrink-0' }"
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-linkedin"
            class="size-6 lg:size-8 shrink-0"
            target="_blank"
            to="https://www.linkedin.com/in/mohammed-alomari-65a884230"
          />
          <UButton
            :ui="{ leadingIcon: 'size-5 lg:size-7 shrink-0' }"
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-facebook"
            class="size-6 lg:size-8 shrink-0"
            target="_blank"
            to="https://facebook.com/sh3boo6"
          />
        </UMarquee>
      </div>
    </UContainer>
  </footer>
</template>
