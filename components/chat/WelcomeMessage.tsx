

export default function WelcomeMessage(){
    return (
        <section className="p-4">
            <h1 className="text-3xl md:text-4xl text-foreground">Hello User!</h1>
            <p className="text-lg md:text-xl text-muted-foreground">How can I help you today?</p>
        </section>
    );
}