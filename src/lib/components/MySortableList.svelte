<script lang="ts">
    import { flip } from "svelte/animate";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic<{ id: string }>;
    export let list: T[];
    let isOver: string | boolean = false;

    const dispatch = createEventDispatcher<{ sort: T[] }>();

    function getDraggedParent(node: Node) {
        if (!(node instanceof HTMLElement) || !node.dataset.index) {
            return getDraggedParent(node.parentElement!);
        } else {
            return { ...node.dataset } as { index: string; id: string };
        }
    }

    function onDragStart(e: DragEvent) {
        if (e.target instanceof Node) {
            const dragged = getDraggedParent(e.target);
            e.dataTransfer?.setData("source", dragged?.index.toString());
        }
    }

    function onDragOver(e: DragEvent) {
        if (e.target instanceof Node) {
            const dragged = getDraggedParent(e.target);
            isOver = dragged?.id ?? false;
        }
    }

    function onDragLeave(e: DragEvent) {
        if (e.target instanceof Node) {
            const dragged = getDraggedParent(e.target);
            isOver === dragged.id && (isOver = false);
        }
    }

    function onDrop(e: DragEvent) {
        if (e.target instanceof Node) {
            isOver = false;
            const dragged = getDraggedParent(e.target);
            reorder(e.dataTransfer?.getData("source")!, dragged.index);
        }
    }

    const reorder = (from: any, to: any) => {
        const newList = [...list];
        const fromValue = newList[from];
        newList[from] = newList[to];
        newList[to] = fromValue;

        dispatch("sort", newList);
    };
</script>

{#if list?.length}
    <ul class="flex flex-col items-center p-0 list-none">
        {#each list as item, index (item.id)}
            <li
                class="w-full max-w-md p-2 transition-all border-2 border-transparent border-dashed"
                class:over={item.id === isOver}
                data-index={index}
                data-id={item.id}
                draggable="true"
                on:dragstart={onDragStart}
                on:dragover|preventDefault={onDragOver}
                on:dragleave={onDragLeave}
                on:drop|preventDefault={onDrop}
                animate:flip={{ duration: 300 }}
            >
                <slot {item} {index} />
            </li>
        {/each}
    </ul>
{:else}
    <p class="my-12 text-lg font-bold text-center">No items</p>
{/if}

<style>
    .over {
        @apply border-gray-400 scale-105;
    }
</style>
