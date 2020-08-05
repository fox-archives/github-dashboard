import '../styles/Home.module.css'
import { defaultExchanges, useQuery } from 'urql'
import { withUrqlClient } from 'next-urql'
import { devtoolsExchange } from '@urql/devtools'
import { Link, Table } from 'evergreen-ui'

function Home() {
	const [res] = useQuery({
		query: /* GraphQL */ `
			{
				viewer {
					avatarUrl
					bio
					bioHTML
					createdAt
					followers {
						totalCount
					}
					location
					login
					repositories(
						first: 100
						affiliations: [OWNER, COLLABORATOR]
						ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
					) {
						totalCount
						nodes {
							# commitComments(first: 10) {
							# 	totalCount
							# 	nodes {
							# 		author {
							# 			login
							# 			url
							# 		}
							# 		authorAssociation
							# 		body
							# 		bodyText
							# 		createdAt
							# 		url
							# 	}
							# }
							# createdAt
							# description
							# descriptionHTML
							# diskUsage
							# forkCount
							# hasIssuesEnabled
							# hasProjectsEnabled
							# hasWikiEnabled
							# homepageUrl
							# isArchived
							# isDisabled
							# isEmpty
							# isFork
							# isLocked
							# isMirror
							# isPrivate
							# isTemplate
							# labels(first: 100) {
							# 	nodes {
							# 		name
							# 	}
							# }
							# languages(first: 100) {
							# 	totalCount
							# 	nodes {
							# 		color
							# 		name
							# 	}
							# }
							# licenseInfo {
							# 	key
							# 	name
							# 	nickname
							# 	spdxId
							# 	url
							# }
							# mirrorUrl
							name
							nameWithOwner
							owner {
								login
								url
							}
							# parent {
							# 	name
							# 	url
							# }
							# primaryLanguage {
							# 	color
							# 	name
							# }
							# sshUrl
							# stargazers(first: 100) {
							# 	nodes {
							# 		login
							# 		url
							# 	}
							# }
							# submodules(first: 100) {
							# 	nodes {
							# 		gitUrl
							# 		name
							# 		path
							# 	}
							# }
							url
							# viewerHasStarred
							# watchers {
							# 	totalCount
							# }
						}
					}
					repositoriesContributedTo(
						first: 100
						contributionTypes: [COMMIT]
					) {
						totalCount
						nodes {
							name
							nameWithOwner
							owner {
								url
								login
							}
							url
						}
					}
					twitterUsername
					url
					websiteUrl
				}
			}
		`,
	})

	if (res.fetching) {
		return <div>Loading</div>
	}
	if (res.error) {
		console.log(res.error.name, res.error.message)
		console.info(res)

		return <div>Error</div>
	}

	const repos = res.data.viewer.repositories.nodes
	const repos2 = res.data.viewer.repositoriesContributedTo.nodes
	console.info(res.data.viewer.repositories.nodes)
	console.info(res.data.viewer.repositoriesContributedTo.nodes)

	const combined = Array.from([...repos, ...repos2])

	return (
		<>
			<h2>{combined.length}</h2>
			<Table width="100%">
				<Table.Head>
					<Table.SearchHeaderCell />
					<Table.TextHeaderCell>Last Activity</Table.TextHeaderCell>
					<Table.TextHeaderCell>ltv</Table.TextHeaderCell>
				</Table.Head>
				<Table.Body>
					{combined.map((node) => (
						<Table.Row key={node.id} isSelectable onSelect={() => {}}>
							<Table.TextCell>
								<Link href={node.url} target="__blank">
									{node.name}
								</Link>
							</Table.TextCell>
							<Table.TextCell>
								<Link href={node.owner.url} target="__blank">
									{node.owner.login}
								</Link>
							</Table.TextCell>
							<Table.TextCell isNumber>{node.ltv}</Table.TextCell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</>
	)
}

export default withUrqlClient((_ssrExchange, ctx) => ({
	url: 'http://localhost:3000/graphql-github',
	exchanges: [devtoolsExchange, ...defaultExchanges],
}))(Home)
