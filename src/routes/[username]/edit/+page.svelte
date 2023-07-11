<script lang="ts">
    import { page } from "$app/stores";
    import MySortableList from "$lib/components/MySortableList.svelte";
    import UserLink from "$lib/components/UserLink.svelte";
    import { db, userData, user, type UserLinkData } from "$lib/firebase";
    import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";

    const icons = ["Twitter", "YouTube", "TikTok", "LinkedIn", "GitHub", "Custom"];

    const formDefaults = {
        icon: "custom",
        title: "",
        url: "https://",
    };

    const formData = writable(formDefaults);

    let showForm = false;

    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;

    async function addLink(_: SubmitEvent) {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            links: arrayUnion({
                ...$formData,
                id: Date.now().toString(),
            }),
        });

        formData.set({
            icon: "",
            title: "",
            url: "",
        });

        showForm = false;
    }

    async function deleteLink(item: UserLinkData) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            links: arrayRemove(item),
        });
    }

    function cancelLink() {
        formData.set(formDefaults);
        showForm = false;
    }

    function sortList(e: CustomEvent<UserLinkData[]>) {
        const newList = e.detail;
        const userRef = doc(db, "users", $user!.uid);
        setDoc(userRef, { links: newList }, { merge: true });
    }
</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <h1 class="mx-2 mt-8 mb-4 text-2xl font-bold text-center">Edit your Profile</h1>

        <MySortableList list={$userData?.links} on:sort={sortList} let:item>
            <div class="relative group">
                <UserLink {...item} />
                <button
                    on:click={() => deleteLink(item)}
                    class="absolute invisible transition-all btn btn-xs btn-error group-hover:visible -right-6 bottom-10"
                >
                    Delete
                </button>
            </div>
        </MySortableList>

        {#if showForm}
            <form
                on:submit|preventDefault={addLink}
                class="w-full p-6 mx-auto bg-base-200 rounded-xl"
            >
                <select name="icon" class="select select-sm" bind:value={$formData.icon}>
                    {#each icons as icon}
                        <option value={icon.toLowerCase()}>{icon}</option>
                    {/each}
                </select>
                <input
                    name="title"
                    type="text"
                    placeholder="Title"
                    class="input input-sm"
                    bind:value={$formData.title}
                />
                <input
                    name="url"
                    type="text"
                    placeholder="URL"
                    class="input input-sm"
                    bind:value={$formData.url}
                />
                <div class="my-4">
                    {#if !titleIsValid}
                        <p class="text-xs text-error">Must have valid title</p>
                    {/if}
                    {#if !urlIsValid}
                        <p class="text-xs text-error">Must have a valid URL</p>
                    {/if}
                    {#if formIsValid}
                        <p class="text-xs text-success">Looks good!</p>
                    {/if}
                </div>

                <button disabled={!formIsValid} type="submit" class="block btn btn-success"
                    >Add Link</button
                >

                <button type="button" class="my-4 btn btn-xs" on:click={cancelLink}>Cancel</button>
            </form>
        {:else}
            <button
                on:click={() => {
                    showForm = true;
                }}
                class="block mx-auto my-4 btn btn-outline btn-info"
            >
                Add a Link
            </button>
        {/if}
    {/if}
</main>
