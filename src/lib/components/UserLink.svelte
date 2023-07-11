<script lang="ts">
    export let icon: string;
    export let url: string;
    export let title: string;
</script>

<a
    href={url}
    class="flex items-center justify-center w-full max-w-md p-4 text-center no-underline rounded-lg stack bg-base-300 not-prose"
>
    <img src={`/${icon}.png`} alt={icon} width="32" height="32" class="w-8" />
    <span class="text-lg font-bold text-white">{title}</span>
</a>
