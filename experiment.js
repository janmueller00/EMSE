let SEED = "666";
Nof1.SET_SEED(SEED);

const typeDefinitions = {
    int: {
        validValues: [0, 1, 5, 10, 42, 100, -5, 999],
        invalidValues: [5.5, '"text"', 'true', '[1, 2]', "{'key': 'val'}"],
        color: '#F78C6C'
    },
    float: {
        validValues: [0.0, 1.5, 3.14, -2.5, 99.9],
        invalidValues: [5, '"text"', 'true', '[1.5]', "{'key': 'val'}"],
        color: '#FFCB6B'
    },
    string: {
        validValues: ['"hello"', '"world"', '"test"', '"John"', '""'],
        invalidValues: [42, 3.14, 'true', '[1]', "{'key': 'val'}"],
        color: '#C3E88D'
    },
    bool: {
        validValues: ['true', 'false'],
        invalidValues: [1, 0, '"true"', '"false"', '[true]'],
        color: '#89DDFF'
    },
    list: {
        validValues: ['[1, 2, 3]', "['a', 'b']", '[]', '[1.5, 2.5]'],
        invalidValues: [42, '"list"', 'true', 1.2],
        color: '#82AAFF'
    }
};

const variableNames = ['x', 'y', 'z', 'a', 'b', 'c', 'i', 'j', 'n', 'm',
    'age', 'name', 'city', 'code', 'data', 'item', 'user', 'total', 'count', 'value',
    'user_age', 'full_name', 'first_name', 'last_name', 'city_code',
    'total_count', 'user_email', 'phone_number', 'postal_code', 'street_address',
    'user_profile_age', 'customer_full_name', 'employee_first_name',
    'system_error_code', 'total_amount_paid', 'maximum_retry_count',
    'default_timeout_value', 'primary_email_address'];

function randInt(max){
    return Math.floor(Math.random()* max)
}
function pick(arr){
    if(!arr || arr.length == 0){
        console.error("pick() called with e or u arr")
        return undefined;
    }

    const index = randInt(arr.length);
    if(index < 0|| index >= arr.length){
        return undefined;
    }
    return arr[index];

}

function generateCode(isAligned, hasHighlighting){
    const typeKeys = Object.keys(typeDefinitions);

    let allNames = [...variableNames]
    for (let i = allNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNames[i], allNames[j]] = [allNames[j], allNames[i]];
    }

    // Generate 5 assignments
    const errorLine = Math.floor(Math.random() * 5);
    const lines = [];
    let maxTypeLen = 0, maxNameLen = 0;

    for (let i = 0; i < 5; i++) {
        const type = pick(typeKeys);
        const name = allNames[i];
        const isCorrect = i !== errorLine;
        const value = String(pick(isCorrect ? typeDefinitions[type].validValues : typeDefinitions[type].invalidValues));

        maxTypeLen = Math.max(maxTypeLen, type.length);
        maxNameLen = Math.max(maxNameLen, name.length);

        lines.push({ type, name, value, color: typeDefinitions[type].color });
    }

    // Format code
    let code = lines.map((l, index) => {
        const typePart = isAligned ? l.type.padEnd(maxTypeLen) : l.type;
        const namePart = isAligned ? l.name.padEnd(maxNameLen) : l.name;
        const valueHTML = hasHighlighting
            ? `<span style="color: ${l.color}; font-weight: bold;">${l.value}</span>`
            : l.value;
        const lineNumberHTML = `<span style="font-size: 0.8em; color: #888;">${index + 1}.</span>`;

        return `${lineNumberHTML} ${typePart} ${namePart} = ${valueHTML}`;
    }).join('\n');

    return { code, correctAnswer: errorLine + 1 };
}

let experiment_configuration_function = (writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, open the browser in fullscreen mode (probably by pressing [F11]).\n"+
            "Welcome to the Code Alignment Experiment!\n" +
            "\n" +
            "In this study, you will see short snippets of code containing five variable declarations.\n" +
            "Your task is simple: identify which line contains a type error.\n" +
            "\n" +
            "A type error occurs when the assigned value does not match the declared type.\n" +
            "\n" +
            "Example:\n" +
            "\n" +
            "    int age    = 25        ← correct\n" +
            "    string name = 42        ← ERROR (number assigned to a string)\n" +
            "\n" +
            "On each trial, press the number (1–5) corresponding to the line you believe contains the error.\n" +
            "\n" +
            "Some code will have aligned spacing, and some will not.  \n" +
            "Some values may also be highlighted to help visibility.\n"
        ),
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the training phase."
        )),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done. Next, the experiment data will be downloaded. Please, send the " +
                "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating."
            )
        )
    ],

    layout: [
        /* ToDo: Hier müssen die Variablen des Experiments rein. Zuerst der Name der Variablen,
                 die unterschiedlichen Werte stehen als List in den Treatments
                 Im ersten Experiment hat man normalerweise nur eine Variable mit 2 Treatments (Werte für die Variable)
         */
        { variable: "Alignment", treatments: ["On", "Off"]},
        { variable: "Highlighting",  treatments: ["On", "Off"]}
    ],

    /* ToDo: Hier gebe ich an, wie oft ich jede Treatmentkombination im Experiment testen möchte */
    repetitions: 5,
    accepted_responses: ["1", "2", "3", "4", "5"],
    /* ToDo: Hier gebe ich an, welche "Art" das Experiment ist. Ich gehe hier davon aus, dass es ein Experiment ist,dass
    *        darauf wartet, dass der Teilnehmer die Taste "0" oder "1" drückt
    *  */
    measurement: Nof1.Reaction_time(Nof1.keys(["1", "2", "3", "4", "5"])),

    task_configuration: (task) => {

        const isAligned = task.treatment_combination.treatment_combination[0].value === "On";
        const hasHighlighting = task.treatment_combination.treatment_combination[1].value === "On";

        const { code, correctAnswer } = generateCode(isAligned, hasHighlighting);
        task.code_html = code;
        task.expected_answer = String(correctAnswer);

        task.do_print_task = () => {

            writer.clear_stage();
            writer.print_html_on_stage(`<pre style="font-family: monospace; font-size: 100%; line-height: 1.6;">${task.code_html}</pre>`);
            writer.print_html_on_stage("<p>Press the line number (1-5).</p>");

        };

        /* ToDo: Legt fest, wann eine Aufgabe als bearbeitet angesehen wird. Die Variable "answer" ist dabei die Taste, die gedrückt wurde.
                 Falls es für das Experiment egal ist, einfach true zurückgeben.
        *  */
        task.accepts_answer_function = (answer) => {
            return true;
        };

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die falsche Taste gedrückt wurde.
         */
        task.do_print_error_message = () => {

        }

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die richtige Taste gedrückt wurde.
         */
        task.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.print_html_on_stage(
                writer.convert_string_to_html_string("Good answer! Press [Enter] to continue.")
            );
        }
    }
}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
