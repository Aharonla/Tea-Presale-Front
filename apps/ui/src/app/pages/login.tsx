import { createRef, useState, useEffect } from 'react';
import type { ComponentProps, FormEvent } from 'react';
import { LoginStatus, useUserContext } from '../context/user.context';
import { SlButton, SlDialog, SlIcon, SlInput } from '@shoelace-style/shoelace/dist/react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const inputRef = createRef<HTMLInputElement>();
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { login, status, agreeToTerms } = useUserContext();

  function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.trim()) {
      login(code);
    } else {
      setMessage('Please enter an access code');
      setTimeout(setMessage, 3000, null);
    }
  }

  useEffect(() => {
    switch (status) {
      case LoginStatus.LOGGED_IN:
        setDialogOpen(false);
        setTimeout(() => navigate('/buy', { replace: true }), 250);
        break;
      case LoginStatus.CODE_VERIFIED:
        setDialogOpen(true);
        break;
      case LoginStatus.WRONG_CODE:
        setMessage('The access code does not exist. You shall not pass!');
        setTimeout(setMessage, 3000, null);
        break;
    }

  }, [navigate, status]);

  return (
    <div className="login">
      {status !== LoginStatus.LOGGED_IN && (
        <form onSubmit={onLoginSubmit}>
          <SlInput
            ref={inputRef as unknown as ComponentProps<typeof SlInput>['ref']}
            className="code"
            onSlInput={(e) => {
              const { value } = e.target as HTMLInputElement;
              setCode(value);
            }}
            value={code}
            placeholder="Enter access code"
            enterkeyhint="done"
            inputmode="text"
            helpText={message || undefined}
            autocomplete="off"
          />
          <SlButton className="submit" size="small" type="submit" disabled={!code.trim()} variant="primary">
            Continue
          </SlButton>
        </form>
      )}
      <SlDialog
        className="terms"
        label="Agree to terms"
        open={dialogOpen}
        onSlAfterHide={() => setDialogOpen(false)}
      >
        <section className="terms__content">
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias at, dignissimos, earum enim ex
            expedita fugit harum, nesciunt nisi officia officiis quia ratione veritatis voluptates! Corporis dolorum
            reiciendis ullam!
          </div>
          <div>Aliquam aliquid aperiam at corporis cupiditate dolore dolorem dolorum ex explicabo facere fuga fugit illo
            ipsa labore libero minima minus natus necessitatibus neque nisi, nostrum perspiciatis ratione. At, numquam,
            tenetur.
          </div>
          <div>Aliquam animi, aspernatur blanditiis dignissimos dolore earum error eveniet fugit, iure laborum modi
            mollitia nesciunt nihil nobis quam quas quos ratione reiciendis repudiandae sunt tempore tenetur ut vero
            voluptate voluptatum!
          </div>
          <div>Aliquam aperiam consectetur consequatur culpa delectus doloribus earum est eveniet exercitationem fuga
            incidunt, inventore laudantium nostrum numquam omnis placeat quae quas, quia quidem quo quod repellendus
            reprehenderit tempore velit, voluptatem!
          </div>
          <div>Aliquam aperiam, assumenda at blanditiis corporis cum cupiditate delectus deserunt distinctio dolor
            excepturi fuga libero nesciunt nobis nulla optio quas ratione saepe sunt temporibus tenetur ullam unde velit
            voluptate voluptatem!
          </div>
          <div>At, aut culpa deserunt dolorem dolores ea enim eos iure neque numquam odio officia officiis quae
            recusandae reprehenderit similique suscipit voluptates voluptatibus! Adipisci minus, reprehenderit? Eum
            eveniet necessitatibus repellat veritatis!
          </div>
          <div>Dolorum magnam minus non officia quidem. Adipisci commodi deserunt facere ipsum iure libero minus nobis
            qui saepe voluptatum. Dolorem doloremque ea harum ipsa laudantium molestias neque perspiciatis quidem
            repellendus sint.
          </div>
          <div>Aliquid consequatur obcaecati tempora vero? Atque deleniti dolorum ducimus eligendi expedita explicabo,
            fuga fugiat ipsa ipsum labore minus non obcaecati odio omnis quas reprehenderit, repudiandae sint tempore ut
            vero, voluptates!
          </div>
          <div>Aspernatur beatae consequuntur cupiditate eius maiores nam nesciunt odio perferendis quae sapiente. Ab ad
            autem beatae, excepturi magnam modi molestias nemo, provident quo quos repudiandae soluta tempora
            temporibus? Aspernatur, iste.
          </div>
          <div>Dolore fugiat mollitia natus quam quisquam? Atque consequuntur dignissimos, dolores, ea error eum,
            eveniet libero necessitatibus odio possimus quae quos repellat sed tenetur vel! Dolorem exercitationem
            mollitia quae vitae! Aliquid.
          </div>
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias at, dignissimos, earum enim ex
            expedita fugit harum, nesciunt nisi officia officiis quia ratione veritatis voluptates! Corporis dolorum
            reiciendis ullam!
          </div>
          <div>Aliquam aliquid aperiam at corporis cupiditate dolore dolorem dolorum ex explicabo facere fuga fugit illo
            ipsa labore libero minima minus natus necessitatibus neque nisi, nostrum perspiciatis ratione. At, numquam,
            tenetur.
          </div>
          <div>Aliquam animi, aspernatur blanditiis dignissimos dolore earum error eveniet fugit, iure laborum modi
            mollitia nesciunt nihil nobis quam quas quos ratione reiciendis repudiandae sunt tempore tenetur ut vero
            voluptate voluptatum!
          </div>
          <div>Aliquam aperiam consectetur consequatur culpa delectus doloribus earum est eveniet exercitationem fuga
            incidunt, inventore laudantium nostrum numquam omnis placeat quae quas, quia quidem quo quod repellendus
            reprehenderit tempore velit, voluptatem!
          </div>
          <div>Aliquam aperiam, assumenda at blanditiis corporis cum cupiditate delectus deserunt distinctio dolor
            excepturi fuga libero nesciunt nobis nulla optio quas ratione saepe sunt temporibus tenetur ullam unde velit
            voluptate voluptatem!
          </div>
          <div>At, aut culpa deserunt dolorem dolores ea enim eos iure neque numquam odio officia officiis quae
            recusandae reprehenderit similique suscipit voluptates voluptatibus! Adipisci minus, reprehenderit? Eum
            eveniet necessitatibus repellat veritatis!
          </div>
          <div>Dolorum magnam minus non officia quidem. Adipisci commodi deserunt facere ipsum iure libero minus nobis
            qui saepe voluptatum. Dolorem doloremque ea harum ipsa laudantium molestias neque perspiciatis quidem
            repellendus sint.
          </div>
          <div>Aliquid consequatur obcaecati tempora vero? Atque deleniti dolorum ducimus eligendi expedita explicabo,
            fuga fugiat ipsa ipsum labore minus non obcaecati odio omnis quas reprehenderit, repudiandae sint tempore ut
            vero, voluptates!
          </div>
          <div>Aspernatur beatae consequuntur cupiditate eius maiores nam nesciunt odio perferendis quae sapiente. Ab ad
            autem beatae, excepturi magnam modi molestias nemo, provident quo quos repudiandae soluta tempora
            temporibus? Aspernatur, iste.
          </div>
          <div>Dolore fugiat mollitia natus quam quisquam? Atque consequuntur dignissimos, dolores, ea error eum,
            eveniet libero necessitatibus odio possimus quae quos repellat sed tenetur vel! Dolorem exercitationem
            mollitia quae vitae! Aliquid.
          </div>
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias at, dignissimos, earum enim ex
            expedita fugit harum, nesciunt nisi officia officiis quia ratione veritatis voluptates! Corporis dolorum
            reiciendis ullam!
          </div>
          <div>Aliquam aliquid aperiam at corporis cupiditate dolore dolorem dolorum ex explicabo facere fuga fugit illo
            ipsa labore libero minima minus natus necessitatibus neque nisi, nostrum perspiciatis ratione. At, numquam,
            tenetur.
          </div>
          <div>Aliquam animi, aspernatur blanditiis dignissimos dolore earum error eveniet fugit, iure laborum modi
            mollitia nesciunt nihil nobis quam quas quos ratione reiciendis repudiandae sunt tempore tenetur ut vero
            voluptate voluptatum!
          </div>
          <div>Aliquam aperiam consectetur consequatur culpa delectus doloribus earum est eveniet exercitationem fuga
            incidunt, inventore laudantium nostrum numquam omnis placeat quae quas, quia quidem quo quod repellendus
            reprehenderit tempore velit, voluptatem!
          </div>
          <div>Aliquam aperiam, assumenda at blanditiis corporis cum cupiditate delectus deserunt distinctio dolor
            excepturi fuga libero nesciunt nobis nulla optio quas ratione saepe sunt temporibus tenetur ullam unde velit
            voluptate voluptatem!
          </div>
          <div>At, aut culpa deserunt dolorem dolores ea enim eos iure neque numquam odio officia officiis quae
            recusandae reprehenderit similique suscipit voluptates voluptatibus! Adipisci minus, reprehenderit? Eum
            eveniet necessitatibus repellat veritatis!
          </div>
          <div>Dolorum magnam minus non officia quidem. Adipisci commodi deserunt facere ipsum iure libero minus nobis
            qui saepe voluptatum. Dolorem doloremque ea harum ipsa laudantium molestias neque perspiciatis quidem
            repellendus sint.
          </div>
          <div>Aliquid consequatur obcaecati tempora vero? Atque deleniti dolorum ducimus eligendi expedita explicabo,
            fuga fugiat ipsa ipsum labore minus non obcaecati odio omnis quas reprehenderit, repudiandae sint tempore ut
            vero, voluptates!
          </div>
          <div>Aspernatur beatae consequuntur cupiditate eius maiores nam nesciunt odio perferendis quae sapiente. Ab ad
            autem beatae, excepturi magnam modi molestias nemo, provident quo quos repudiandae soluta tempora
            temporibus? Aspernatur, iste.
          </div>
          <div>Dolore fugiat mollitia natus quam quisquam? Atque consequuntur dignissimos, dolores, ea error eum,
            eveniet libero necessitatibus odio possimus quae quos repellat sed tenetur vel! Dolorem exercitationem
            mollitia quae vitae! Aliquid.
          </div>
        </section>
        <div slot="footer">
          <SlButton variant="primary" size="small" className="terms__actions" onClick={agreeToTerms}>
            <SlIcon name="check2-circle" style={{ marginRight: '0.5em' }} />
            I agree to the terms
          </SlButton>
        </div>
      </SlDialog>
    </div>
  )
    ;
};
