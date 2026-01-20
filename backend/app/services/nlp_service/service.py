def run_nlp_pipeline(text: str):
    return {
        "input": text,
        "tokens": text.split(),
        "length": len(text)
    }
