export const ExternalLink = (props: React.JSX.IntrinsicElements["a"]) => (
	<a rel="noopener noreferrer" target="_blank" {...props} />
);

export const MDN = ({ tag }) => (
	<ExternalLink
		href={`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/${tag}`}
	>
		<code>{`<${tag}>`}</code>
	</ExternalLink>
);

export const CSSProp = ({ property, value }) => (
	<code>
		<ExternalLink
			href={`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/${property}`}
		>
			{property}
		</ExternalLink>
		{value && `: ${value}`}
	</code>
);

export const CSSSelector = ({ selector }) => (
	<code>
		<ExternalLink
			href={`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/${selector}`}
		>
			{selector}
		</ExternalLink>
	</code>
);
